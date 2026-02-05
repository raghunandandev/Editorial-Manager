const User = require('../models/User');
const Manuscript = require('../models/Manuscript');
const Assignment = require('../models/Assignment');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

exports.getDashboardStats = async (_req, res) => {
  try {
    const [
      totalUsers,
      totalAuthors,
      totalReviewers,
      totalEditors,
      totalManuscripts,
      pendingManuscripts,
      underReviewManuscripts,
      users,
      reviewers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'roles.author': true }),
      User.countDocuments({ 'roles.reviewer': true }),
      User.countDocuments({ 'roles.editor': true }),
      Manuscript.countDocuments(),
      Manuscript.countDocuments({ status: 'submitted' }),
      Manuscript.countDocuments({ status: 'under_review' }),
      User.find({}, 'firstName lastName email roles'),
      User.find({ 'roles.reviewer': true }, 'firstName lastName profile.expertise')
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalAuthors,
          totalReviewers,
          totalEditors,
          totalManuscripts,
          pendingManuscripts,
          underReviewManuscripts
        },
        users: users.map((u) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          roles: u.roles
        })),
        reviewers: reviewers.map((r) => ({
          id: r._id,
          name: `${r.firstName} ${r.lastName}`,
          expertise: r.profile?.expertise?.join(', ') || 'General'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

exports.getPendingManuscripts = async (_req, res) => {
  try {
    const manuscripts = await Manuscript.find({
      $or: [
        { status: { $in: ['submitted', 'under_review', 'revisions_required'] } },
        { workflowStatus: { $in: ['UNDER_REVIEW', 'REVIEW_IN_PROGRESS'] } }
      ]
    })
      .populate('correspondingAuthor', 'firstName lastName')
      .populate('assignedEditors.editor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        manuscripts: manuscripts.map((m) => ({
          id: m._id,
          title: m.title,
          author: m.correspondingAuthor
            ? `${m.correspondingAuthor.firstName} ${m.correspondingAuthor.lastName}`
            : 'Unknown',
          domain: m.domain,
          submittedOn: m.submissionDate,
          status: m.status,
          currentRound: m.currentRound || 1,
          revisions: (m.revisions || []).map(r => ({ round: r.round, submittedDate: r.submittedDate }))
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending manuscripts',
      error: error.message
    });
  }
};

exports.assignReviewer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { manuscriptId, reviewerId, dueDate } = req.body;

    const manuscript = await Manuscript.findById(manuscriptId);
    const reviewer = await User.findById(reviewerId);
    const editor = req.user.id;

    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found'
      });
    }

    if (!reviewer || !reviewer.roles.reviewer) {
      return res.status(400).json({
        success: false,
        message: 'User is not a reviewer'
      });
    }

    const existingAssignment = await Assignment.findOne({
      manuscript: manuscriptId,
      reviewer: reviewerId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Reviewer already assigned to this manuscript'
      });
    }

    const assignment = new Assignment({
      manuscript: manuscriptId,
      reviewer: reviewerId,
      editor,
      assignedBy: editor,
      round: manuscript.currentRound || 1,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    await assignment.save();

    manuscript.status = 'under_review';
    manuscript.workflowStatus = 'UNDER_REVIEW';
    await manuscript.save();

    await emailService.notifyReviewAssignment(reviewer.email, manuscript, assignment);

    res.status(201).json({
      success: true,
      message: 'Reviewer assigned successfully',
      data: { assignment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning reviewer',
      error: error.message
    });
  }
};

exports.updateUserRoles = async (req, res) => {
  try {
    const { userId, roles } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.roles = { ...user.roles, ...roles };
    await user.save();

    res.json({
      success: true,
      message: 'User roles updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user roles',
      error: error.message
    });
  }
};

exports.setManuscriptStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const manuscript = await Manuscript.findById(req.params.id);

    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found'
      });
    }

    manuscript.status = status;
    await manuscript.save();

    res.json({
      success: true,
      message: 'Manuscript status updated',
      data: { manuscript }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating manuscript status',
      error: error.message
    });
  }
};

exports.editorDecision = async (req, res) => {
  try {
    const { decision } = req.body;
    const manuscript = await Manuscript.findById(req.params.id);

    if (!manuscript) return res.status(404).json({ success: false, message: 'Manuscript not found' });

    if (decision === 'accept') {
      manuscript.status = 'accepted';
      manuscript.workflowStatus = 'EDITOR_ACCEPTED';
      try {
        const pages = manuscript.manuscriptFile?.pages || 1;
        const baseAmount = 5;
        const extraPages = pages > 6 ? pages - 6 : 0;
        const totalAmount = baseAmount + (extraPages * 10);

        manuscript.publicationCharges = manuscript.publicationCharges || {};
        manuscript.publicationCharges.baseAmount = baseAmount;
        manuscript.publicationCharges.extraPages = extraPages;
        manuscript.publicationCharges.totalAmount = totalAmount;

        const payment = {
          paymentId: `pay_${Date.now()}`,
          amount: totalAmount,
          timestamp: new Date(),
          status: 'pending',
          metadata: {}
        };

        manuscript.payments = manuscript.payments || [];
        manuscript.payments.push(payment);
        manuscript.workflowStatus = 'PAYMENT_PENDING';
        await manuscript.save();

        const author = await User.findById(manuscript.correspondingAuthor);
        if (author) {
          await emailService.notifyAuthorPaymentRequest(author.email, manuscript, payment);
        }
      } catch (e) {
        console.warn('Failed to create payment placeholder or notify author:', e.message);
      }
    } else if (decision === 'reject') {
      manuscript.status = 'rejected';
      manuscript.workflowStatus = 'REVIEW_ACCEPTED';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid decision' });
    }

    await manuscript.save();

    res.json({ success: true, message: 'Editor decision recorded', data: { manuscript } });
  } catch (error) {
    console.error('Editor decision error:', error);
    res.status(500).json({ success: false, message: 'Error recording decision', error: error.message });
  }
};

exports.requestPayment = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id).populate('correspondingAuthor');
    if (!manuscript) return res.status(404).json({ success: false, message: 'Manuscript not found' });

    if (manuscript.workflowStatus !== 'EDITOR_ACCEPTED' && manuscript.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Manuscript is not ready for payment request' });
    }

    if (!manuscript.publicationCharges || typeof manuscript.publicationCharges.totalAmount !== 'number' || manuscript.publicationCharges.totalAmount <= 0) {
      console.error('Invalid publicationCharges for manuscript:', req.params.id, manuscript.publicationCharges);
      manuscript.publicationCharges = {
        baseAmount: 5,
        extraPages: 0,
        totalAmount: 5
      };
      await manuscript.save();
    }

    const payment = {
      paymentId: `pay_${Date.now()}`,
      amount: manuscript.publicationCharges.totalAmount,
      timestamp: new Date(),
      status: 'pending',
      metadata: {}
    };

    manuscript.payments = manuscript.payments || [];
    manuscript.payments.push(payment);
    manuscript.workflowStatus = 'PAYMENT_PENDING';
    await manuscript.save();

    try {
      await emailService.notifyAuthorPaymentRequest(manuscript.correspondingAuthor.email, manuscript, payment);
    } catch (e) {
      console.warn('Payment notification failed', e.message);
    }

    res.json({ success: true, message: 'Payment requested', data: { payment } });
  } catch (error) {
    console.error('Request payment error:', error);
    res.status(500).json({ success: false, message: 'Error requesting payment', error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const manuscripts = await Manuscript.find({ 'payments.0': { $exists: true } })
      .select('title correspondingAuthor payments')
      .populate('correspondingAuthor', 'firstName lastName email');

    const payments = [];
    manuscripts.forEach(m => {
      (m.payments || []).forEach(p => {
        payments.push({
          manuscriptId: m._id,
          manuscriptTitle: m.title,
          author: m.correspondingAuthor ? `${m.correspondingAuthor.firstName} ${m.correspondingAuthor.lastName}` : 'Unknown',
          authorEmail: m.correspondingAuthor?.email || null,
          paymentId: p.paymentId,
          amount: p.amount,
          status: p.status,
          timestamp: p.timestamp,
          metadata: p.metadata || {}
        });
      });
    });

    payments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, data: { payments, count: payments.length } });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};