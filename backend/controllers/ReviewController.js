const Review = require('../models/Review');
const Manuscript = require('../models/Manuscript');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

exports.submitReview = async (req, res) => {
  try {
    const { manuscriptId } = req.params;
    const {
      scores,
      commentsToAuthor,
      commentsToEditor,
      confidentialComments,
      recommendation
    } = req.body;

    const assignment = await Assignment.findOne({
      manuscript: manuscriptId,
      reviewer: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    }).populate('manuscript');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Review assignment not found or already completed'
      });
    }

    if (assignment.status === 'pending') {
      assignment.status = 'accepted';
      await assignment.save();
    }

    const existingReview = await Review.findOne({
      manuscript: manuscriptId,
      reviewer: req.user.id,
      round: assignment.manuscript.currentRound
    });

    if (existingReview && existingReview.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this round'
      });
    }

    const scoreValues = Object.values(scores);
    const overallScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;

    let review;
    if (existingReview) {
      review = await Review.findByIdAndUpdate(
        existingReview._id,
        {
          scores,
          overallScore,
          commentsToAuthor,
          commentsToEditor,
          confidentialComments,
          recommendation,
          submittedDate: new Date(),
          status: 'submitted'
        },
        { new: true, runValidators: true }
      );
    } else {
      review = new Review({
        manuscript: manuscriptId,
        reviewer: req.user.id,
        round: assignment.manuscript.currentRound,
        scores,
        overallScore,
        commentsToAuthor,
        commentsToEditor,
        confidentialComments,
        recommendation,
        submittedDate: new Date(),
        status: 'submitted'
      });
      await review.save();
    }

    assignment.status = 'completed';
    assignment.review = review._id;
    await assignment.save();

    await updateManuscriptStatus(manuscriptId);

    await emailService.notifyReviewSubmitted(
      assignment.editor,
      assignment.manuscript,
      review
    );

    if (['minor_revisions', 'major_revisions'].includes(recommendation)) {
      await emailService.notifyAuthorRevision(
        assignment.manuscript.correspondingAuthor,
        assignment.manuscript,
        review
      );
    }

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
};

exports.acceptReviewAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      reviewer: req.user.id,
      status: 'pending'
    }).populate('manuscript');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or already processed'
      });
    }

    assignment.status = 'accepted';
    await assignment.save();

    if (assignment.manuscript) {
      const manuscript = await Manuscript.findById(assignment.manuscript._id);
      if (manuscript) {
        manuscript.workflowStatus = 'REVIEW_IN_PROGRESS';
        await manuscript.save();
      }
    }

    await emailService.notifyReviewAssignmentAccepted(
      assignment.editor,
      assignment.manuscript,
      req.user
    );

    res.json({
      success: true,
      message: 'Review assignment accepted successfully',
      data: { assignment }
    });
  } catch (error) {
    console.error('Accept assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting review assignment',
      error: error.message
    });
  }
};

exports.declineReviewAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { reason } = req.body;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      reviewer: req.user.id,
      status: 'pending'
    }).populate('manuscript');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or already processed'
      });
    }

    assignment.status = 'declined';
    await assignment.save();

    await emailService.notifyReviewAssignmentDeclined(
      assignment.editor,
      assignment.manuscript,
      req.user,
      reason
    );

    res.json({
      success: true,
      message: 'Review assignment declined successfully',
      data: { assignment }
    });
  } catch (error) {
    console.error('Decline assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error declining review assignment',
      error: error.message
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updateData = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      reviewer: req.user.id,
      status: { $ne: 'submitted' }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or already submitted'
      });
    }

    if (updateData.scores) {
      const scoreValues = Object.values(updateData.scores);
      updateData.overallScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ...updateData, status: 'in_progress' },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;

    let query = { reviewer: req.user.id };
    if (status) {
      query.status = status;
    }

    const assignments = await Assignment.find(query)
      .populate({
        path: 'manuscript',
        select: 'title abstract domain status submissionDate manuscriptFile currentRound revisions',
        populate: {
          path: 'correspondingAuthor',
          select: 'firstName lastName email profile.affiliation'
        }
      })
      .populate('editor', 'firstName lastName email')
      .populate('review', 'overallScore recommendation submittedDate status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assignment.countDocuments(query);

    const deduped = [];
    const seen = new Map();
    for (const a of assignments) {
      const manId = a.manuscript && a.manuscript._id ? a.manuscript._id.toString() : 'unknown';
      const round = a.round || (a.manuscript && a.manuscript.currentRound) || 1;
      const key = `${manId}_${round}`;
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, a);
        deduped.push(a);
      } else {
        if (a.createdAt && existing.createdAt && a.createdAt > existing.createdAt) {
          const idx = deduped.indexOf(existing);
          if (idx !== -1) deduped[idx] = a;
          seen.set(key, a);
        }
      }
    }

    res.json({
      success: true,
      data: {
        assignments: deduped,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review assignments',
      error: error.message
    });
  }
};

exports.getReviewerStatistics = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    const completedReviews = await Review.find({
      reviewer: reviewerId,
      status: 'submitted'
    }).populate({
      path: 'manuscript',
      select: 'domain'
    });

    const [totalAssignments, pendingAssignments, acceptedAssignments, completedAssignments] = await Promise.all([
      Assignment.countDocuments({ reviewer: reviewerId }),
      Assignment.countDocuments({ reviewer: reviewerId, status: 'pending' }),
      Assignment.countDocuments({ reviewer: reviewerId, status: 'accepted' }),
      Assignment.countDocuments({ reviewer: reviewerId, status: 'completed' })
    ]);

    const minorRevisions = completedReviews.filter(r => r.recommendation === 'minor_revisions').length;
    const majorRevisions = completedReviews.filter(r => r.recommendation === 'major_revisions').length;
    const acceptedManuscripts = completedReviews.filter(r => r.recommendation === 'accept').length;

    const averageScoreResult = await Review.aggregate([
      { $match: { reviewer: reviewerId, status: 'submitted' } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);

    const assignmentsWithReviews = await Assignment.find({
      reviewer: reviewerId,
      status: 'completed'
    }).populate('review');

    let fastestReviewDays = 0;
    if (assignmentsWithReviews.length > 0) {
      const responseTimes = assignmentsWithReviews
        .filter(a => a.review && a.review.submittedDate)
        .map(a => {
          const responseTime = a.review.submittedDate - a.createdAt;
          return responseTime / (1000 * 60 * 60 * 24);
        });
      fastestReviewDays = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    }

    const domainCounts = {};
    completedReviews.forEach(review => {
      if (review.manuscript && review.manuscript.domain) {
        domainCounts[review.manuscript.domain] = (domainCounts[review.manuscript.domain] || 0) + 1;
      }
    });
    const topDomain = Object.keys(domainCounts).length > 0
      ? Object.keys(domainCounts).reduce((a, b) => domainCounts[a] > domainCounts[b] ? a : b)
      : null;

    const averageResponseTime = await calculateAverageResponseTime(reviewerId);

    const stats = {
      totalAssignments,
      awaitingReview: pendingAssignments + acceptedAssignments, // pending + accepted
      reviewSubmitted: completedAssignments,
      averageScore: averageScoreResult.length > 0 ? parseFloat(averageScoreResult[0].avgScore.toFixed(2)) : 0,
      fastestReviewDays: parseFloat(fastestReviewDays.toFixed(1)),
      topDomainReviewed: topDomain,
      minorRevisions,
      majorRevisions,
      acceptedManuscripts,
      averageResponseTimeDays: parseFloat(averageResponseTime.toFixed(1))
    };

    res.json({
      success: true,
      data: { statistics: stats }
    });
  } catch (error) {
    console.error('Get reviewer statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviewer statistics',
      error: error.message
    });
  }
};

exports.getReviewDetails = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate({
        path: 'manuscript',
        select: 'title abstract domain keywords manuscriptFile'
      })
      .populate('reviewer', 'firstName lastName email profile.expertise');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const isOwner = review.reviewer._id.toString() === req.user.id;
    const isEditor = req.user.roles.editor || req.user.roles.editorInChief;

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this review'
      });
    }

    if (!isEditor) {
      review.confidentialComments = undefined;
    }

    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    console.error('Get review details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review details',
      error: error.message
    });
  }
};

exports.getManuscriptForReview = async (req, res) => {
  try {
    const { manuscriptId } = req.params;
    const reviewerId = req.user.id;

    const assignment = await Assignment.findOne({
      manuscript: manuscriptId,
      reviewer: reviewerId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to review this manuscript'
      });
    }

    const manuscript = await Manuscript.findById(manuscriptId)
      .populate('correspondingAuthor', 'firstName lastName email profile.affiliation')
      .populate('authors.user', 'firstName lastName email profile.affiliation');

    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found'
      });
    }

    const existingReview = await Review.findOne({
      manuscript: manuscriptId,
      reviewer: reviewerId,
      round: manuscript.currentRound
    });

    const response = {
      manuscript: {
        ...manuscript.toObject(),
        currentRound: manuscript.currentRound,
        revisionHistory: manuscript.revisions || [],
        isRevised: manuscript.revisions && manuscript.revisions.length > 0
      },
      assignment,
      existingReview
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get manuscript for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching manuscript for review',
      error: error.message
    });
  }
};

exports.getManuscriptReviews = async (req, res) => {
  try {
    const { manuscriptId } = req.params;

    const manuscript = await Manuscript.findById(manuscriptId);
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found'
      });
    }

    const isEditor = req.user.roles?.editorInChief || req.user.roles?.editor;
    const isAuthor = String(manuscript.correspondingAuthor) === String(req.user.id);

    if (!isEditor && !isAuthor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view reviews for this manuscript'
      });
    }

    const reviews = await Review.find({ manuscript: manuscriptId })
      .populate('reviewer', 'firstName lastName email profile.expertise profile.affiliation')
      .sort({ submittedDate: -1 });

    if (isAuthor && !isEditor) {
      reviews.forEach(r => {
        if (r.reviewer && typeof r.reviewer === 'object') {
          try {
            r.reviewer.firstName = 'Anonymous';
            r.reviewer.lastName = 'Reviewer';
            r.reviewer.email = undefined;
          } catch (e) {
            // ignore if structure differs
          }
        }
      });
    }

    const decision = calculateOverallDecision(reviews);

    if (req.user.roles && req.user.roles.editorInChief) {
      reviews.forEach(r => {
        try {
          r.commentsToAuthor = undefined;
        } catch (e) {
          // ignore
        }
      });
    }

    res.json({
      success: true,
      data: {
        reviews,
        decision,
        totalReviews: reviews.length,
        submittedReviews: reviews.filter(r => r.status === 'submitted').length
      }
    });
  } catch (error) {
    console.error('Get manuscript reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching manuscript reviews',
      error: error.message
    });
  }
};

const updateManuscriptStatus = async (manuscriptId) => {
  const reviews = await Review.find({
    manuscript: manuscriptId,
    status: 'submitted',
    round: { $exists: true }
  });

  const manuscript = await Manuscript.findById(manuscriptId);
  
  if (reviews.length >= 2) {
    const recommendations = reviews.map(r => r.recommendation);
    
    if (recommendations.every(rec => rec === 'accept')) {
      manuscript.status = 'accepted';
      manuscript.workflowStatus = 'REVIEW_ACCEPTED';
    } else if (recommendations.some(rec => rec === 'reject')) {
      manuscript.status = 'rejected';
    } else if (recommendations.some(rec => ['minor_revisions', 'major_revisions'].includes(rec))) {
      manuscript.status = 'revisions_required';
    }
    
    await manuscript.save();
  }
};

const calculateAverageResponseTime = async (reviewerId) => {
  const assignments = await Assignment.find({
    reviewer: reviewerId,
    status: 'completed'
  }).populate('review');

  if (assignments.length === 0) return 0;

  const totalResponseTime = assignments.reduce((total, assignment) => {
    if (assignment.review && assignment.review.submittedDate) {
      const responseTime = assignment.review.submittedDate - assignment.createdAt;
      return total + responseTime;
    }
    return total;
  }, 0);

  return totalResponseTime / assignments.length / (1000 * 60 * 60 * 24);
};

const calculateOverallDecision = (reviews) => {
  const submittedReviews = reviews.filter(r => r.status === 'submitted');
  
  if (submittedReviews.length === 0) return 'pending';
  
  const recommendations = submittedReviews.map(r => r.recommendation);
  
  const counts = {};
  recommendations.forEach(rec => {
    counts[rec] = (counts[rec] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const decision = Object.keys(counts).find(rec => counts[rec] === maxCount);

  return decision || 'pending';
};

module.exports = exports;