const Manuscript = require('../models/Manuscript');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Review = require('../models/Review');
const { uploadToCloudinary } = require('../middleware/upload');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');
const path = require('path');

exports.downloadManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    
    if (!manuscript || !manuscript.manuscriptFile?.url) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found or file is missing'
      });
    }

    if (manuscript.manuscriptFile.public_id && !manuscript.manuscriptFile.public_id.startsWith('local_')) {
      const fileUrl = cloudinary.url(manuscript.manuscriptFile.public_id, {
        resource_type: 'raw',
        flags: 'attachment',
        attachment: true,
        secure: true
      });
      return res.json({
        success: true,
        downloadUrl: fileUrl
      });
    } else if (manuscript.manuscriptFile.url && manuscript.manuscriptFile.url.includes('cloudinary.com')) {
      try {
        const url = new URL(manuscript.manuscriptFile.url);
        url.searchParams.set('fl', 'attachment');
        return res.json({
          success: true,
          downloadUrl: url.toString()
        });
      } catch (e) {
        return res.json({
          success: true,
          downloadUrl: manuscript.manuscriptFile.url
        });
      }
    }

    const filePath = path.join(__dirname, '..', manuscript.manuscriptFile.url);
    res.download(filePath, `manuscript-${manuscript._id}.pdf`);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading manuscript'
    });
  }
};

exports.downloadAcceptedManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    
    if (!manuscript || !manuscript.manuscriptFile?.url) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found or file is missing'
      });
    }

    if (manuscript.status !== 'published' && manuscript.workflowStatus !== 'PUBLISHED') {
      return res.status(403).json({
        success: false,
        message: 'This manuscript is not available for download'
      });
    }

    if (manuscript.manuscriptFile.public_id && !manuscript.manuscriptFile.public_id.startsWith('local_')) {
      const fileUrl = cloudinary.url(manuscript.manuscriptFile.public_id, {
        resource_type: 'raw',
        flags: 'attachment',
        attachment: true,
        secure: true
      });
      return res.json({
        success: true,
        downloadUrl: fileUrl
      });
    } else if (manuscript.manuscriptFile.url && manuscript.manuscriptFile.url.includes('cloudinary.com')) {
      try {
        const url = new URL(manuscript.manuscriptFile.url);
        url.searchParams.set('fl', 'attachment');
        return res.json({
          success: true,
          downloadUrl: url.toString()
        });
      } catch (e) {
        return res.json({
          success: true,
          downloadUrl: manuscript.manuscriptFile.url
        });
      }
    }

    const filePath = path.join(__dirname, '..', manuscript.manuscriptFile.url);
    res.download(filePath, `manuscript-${manuscript._id}.pdf`);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading manuscript'
    });
  }
};

exports.submitManuscript = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Manuscript file is required'
      });
    }

    const { title, abstract, keywords, domain } = req.body;
    
    let manuscriptFileData;
    
    if (req.file) {
      if (req.file.buffer) {
        try {
          const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
          manuscriptFileData = {
            public_id: cloudinaryResult.public_id,
            url: cloudinaryResult.secure_url,
            pages: 1,
            size: req.file.size
          };
        } catch (cloudinaryError) {
          manuscriptFileData = {
            public_id: `local_${Date.now()}`,
            url: `/uploads/${req.file.filename}`,
            pages: 1,
            size: req.file.size
          };
        }
      } else if (req.file.path) {
        manuscriptFileData = {
          public_id: req.file.filename || req.file.public_id,
          url: req.file.path || req.file.secure_url,
          pages: 1,
          size: req.file.size
        };
      } else {
        return res.status(400).json({
          success: false,
          message: 'File upload failed. No file data received.'
        });
      }
    }

    const pages = manuscriptFileData.pages;
    const baseAmount = 5;
    const extraPages = pages > 6 ? pages - 6 : 0;
    const totalAmount = baseAmount + (extraPages * 10);

    const manuscript = new Manuscript({
      title,
      abstract,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
      domain,
      authors: [{
        user: req.user.id,
        isCorresponding: true,
        order: 1
      }],
      correspondingAuthor: req.user.id,
      manuscriptFile: manuscriptFileData,
      publicationCharges: {
        baseAmount,
        extraPages,
        totalAmount
      }
    });

    manuscript.workflowStatus = 'SUBMITTED';

    await manuscript.save();

    try {
      const editorInChief = await User.findOne({ 'roles.editorInChief': true });
      if (editorInChief) {
        await emailService.notifyNewSubmission(editorInChief.email, manuscript);
      }
    } catch (emailError) {
    }

    res.status(201).json({
      success: true,
      message: 'Manuscript submitted successfully',
      data: { manuscript }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting manuscript',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

exports.getMyManuscripts = async (req, res) => {
  try {
    const manuscripts = await Manuscript.find({
      correspondingAuthor: req.user.id
    })
    .populate('assignedEditors.editor', 'firstName lastName email')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { manuscripts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching manuscripts',
      error: error.message
    });
  }
};

exports.getManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id)
      .populate('authors.user', 'firstName lastName email profile')
      .populate('correspondingAuthor', 'firstName lastName email')
      .populate('assignedEditors.editor', 'firstName lastName email');

    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found'
      });
    }

    const isAuthor = manuscript.authors.some(author => 
      author.user._id.toString() === req.user.id
    );
    const isEditor = req.user.roles.editor || req.user.roles.editorInChief;

    if (!isAuthor && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (isEditor) {
      try {
        const reviews = await Review.find({ manuscript: manuscript._id })
          .populate('reviewer', 'firstName lastName email')
          .sort({ submittedDate: 1 });

        return res.json({ success: true, data: { manuscript, reviews } });
      } catch (e) {
        return res.json({ success: true, data: { manuscript } });
      }
    }

    res.json({
      success: true,
      data: { manuscript }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching manuscript',
      error: error.message
    });
  }
};

exports.getAcceptedManuscripts = async (req, res) => {
  try {
    const { search } = req.query;
    
    const filter = {
      $or: [
        { status: 'published' },
        { workflowStatus: 'PUBLISHED' }
      ]
    };

    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const manuscripts = await Manuscript.find(filter)
      .populate('authors.user', 'name email')
      .populate('correspondingAuthor', 'name email affiliation')
      .select('title abstract keywords domain authors correspondingAuthor manuscriptFile status workflowStatus submissionDate publishedAt')
      .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: {
        manuscripts,
        count: manuscripts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching manuscripts',
      error: error.message
    });
  }
};

exports.getPublishedManuscripts = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {
      $or: [
        { workflowStatus: 'PUBLISHED' },
        { status: 'published' }
      ]
    };

    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const manuscripts = await Manuscript.find(filter)
      .populate('authors.user', 'name email')
      .populate('correspondingAuthor', 'name email affiliation')
      .select('title abstract keywords domain authors correspondingAuthor manuscriptFile status workflowStatus submissionDate publishedAt')
      .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: { manuscripts, count: manuscripts.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching manuscripts', error: error.message });
  }
};

exports.downloadPublishedManuscript = async (req, res) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);

    if (!manuscript || !manuscript.manuscriptFile?.url) {
      return res.status(404).json({ success: false, message: 'Manuscript not found or file is missing' });
    }

    if (!(manuscript.workflowStatus === 'PUBLISHED' || manuscript.status === 'published')) {
      return res.status(403).json({ success: false, message: 'This manuscript is not publicly available' });
    }

    if (manuscript.manuscriptFile.public_id && !manuscript.manuscriptFile.public_id.startsWith('local_')) {
      const fileUrl = cloudinary.url(manuscript.manuscriptFile.public_id, {
        resource_type: 'raw',
        flags: 'attachment',
        attachment: true,
        secure: true
      });
      return res.json({ success: true, downloadUrl: fileUrl });
    } else if (manuscript.manuscriptFile.url && manuscript.manuscriptFile.url.includes('cloudinary.com')) {
      try {
        const url = new URL(manuscript.manuscriptFile.url);
        url.searchParams.set('fl', 'attachment');
        return res.json({ success: true, downloadUrl: url.toString() });
      } catch (e) {
        return res.json({ success: true, downloadUrl: manuscript.manuscriptFile.url });
      }
    }

    const filePath = path.join(__dirname, '..', manuscript.manuscriptFile.url);
    res.download(filePath, `manuscript-${manuscript._id}.pdf`);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error downloading manuscript' });
  }
};

exports.submitRevision = async (req, res) => {
  try {
    const { manuscriptId } = req.params;
    const { revisionNotes } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Revised manuscript file is required'
      });
    }

    const manuscript = await Manuscript.findById(manuscriptId);
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Manuscript not found'
      });
    }

    if (manuscript.correspondingAuthor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to submit revisions for this manuscript'
      });
    }

    if (manuscript.status !== 'revisions_required') {
      return res.status(400).json({
        success: false,
        message: 'This manuscript does not require revisions'
      });
    }

    let manuscriptFileData;
    try {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      manuscriptFileData = {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        pages: 1,
        size: req.file.size
      };
    } catch (cloudinaryError) {
      manuscriptFileData = {
        public_id: `local_${Date.now()}`,
        url: `/uploads/${req.file.filename}`,
        pages: 1,
        size: req.file.size
      };
    }

    manuscript.currentRound = (manuscript.currentRound || 1) + 1;
    
    manuscript.manuscriptFile = manuscriptFileData;
    manuscript.status = 'under_review';
    manuscript.workflowStatus = 'REVIEW_IN_PROGRESS';
    
    if (!manuscript.revisions) {
      manuscript.revisions = [];
    }
    manuscript.revisions.push({
      round: manuscript.currentRound,
      submittedDate: new Date(),
      notes: revisionNotes || '',
      file: manuscriptFileData
    });

    await manuscript.save();

    if (manuscript.assignedEditors && manuscript.assignedEditors.length > 0) {
      try {
        const editorIds = manuscript.assignedEditors.map(e => e.editor);
        const editors = await User.find({ _id: { $in: editorIds } });
        for (const editor of editors) {
          await emailService.notifyRevisionSubmitted(editor.email, manuscript);
        }
      } catch (emailError) {
      }
    }

    let createdAssignments = [];
    try {
      const prevAssignments = await Assignment.find({ manuscript: manuscript._id, status: 'completed' });
      if (prevAssignments && prevAssignments.length > 0) {
        const uniqueReviewerIds = [...new Set(prevAssignments.map(pa => pa.reviewer.toString()))];
        const dueOffsetMs = 14 * 24 * 60 * 60 * 1000;
        for (const reviewerId of uniqueReviewerIds) {
          const existing = await Assignment.findOne({
            manuscript: manuscript._id,
            reviewer: reviewerId,
            round: manuscript.currentRound,
            status: { $in: ['pending', 'accepted'] }
          });
          if (existing) continue;

          const pa = prevAssignments.find(p => p.reviewer.toString() === reviewerId.toString());
          const editorForAssignment = pa ? pa.editor : (manuscript.assignedEditors && manuscript.assignedEditors[0] && manuscript.assignedEditors[0].editor) || null;

          const newAssignment = new Assignment({
            manuscript: manuscript._id,
            reviewer: reviewerId,
            editor: editorForAssignment,
            assignedBy: req.user.id,
            dueDate: new Date(Date.now() + dueOffsetMs),
            status: 'pending',
            round: manuscript.currentRound
          });
          await newAssignment.save();
          createdAssignments.push(newAssignment._id);

          

          try {
            const reviewerUser = await User.findById(reviewerId);
            if (reviewerUser && reviewerUser.email) {
              await emailService.notifyReviewAssignment(reviewerUser.email, manuscript, newAssignment);
            }
          } catch (notifyErr) {
          }
        }
      }
    } catch (assignErr) {
    }

    res.json({
      success: true,
      message: 'Revision submitted successfully',
      data: {
        manuscript,
        newRound: manuscript.currentRound,
        createdAssignments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting revision',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};
