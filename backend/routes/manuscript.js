// routes/manuscripts.js
const express = require('express');
const { body } = require('express-validator');
const { 
  submitManuscript, 
  getMyManuscripts, 
  getManuscript,
  downloadManuscript,
  downloadAcceptedManuscript,
  getAcceptedManuscripts
} = require('../controllers/manuscriptController');
const { auth, authorize } = require('../middleware/auth');
const requireOrcidVerification = require('../middleware/requireOrcidVerification');
const { upload, handleUploadErrors } = require('../middleware/upload'); // Updated import
const { validate } = require('../middleware/validate'); // Add this middleware

const router = express.Router();

// Public routes - no authentication required
router.get('/accepted', getAcceptedManuscripts);
router.get('/accepted/:id/download', downloadAcceptedManuscript);
// Public published endpoints
router.get('/published', require('../controllers/manuscriptController').getPublishedManuscripts);
router.get('/published/:id/download', require('../controllers/manuscriptController').downloadPublishedManuscript);

router.post('/submit', 
  [
    auth,
    authorize('author'),
    requireOrcidVerification,
    upload.single('manuscript'), // Use the upload middleware
    body('title').notEmpty().withMessage('Title is required'),
    body('abstract').notEmpty().withMessage('Abstract is required'),
    body('domain').notEmpty().withMessage('Domain is required'),
    validate,
    handleUploadErrors // Add error handling
  ],
  submitManuscript
);

router.get('/my-manuscripts', auth, authorize('author'), getMyManuscripts);
router.get('/:id', auth, getManuscript);
router.get('/:id/download', auth, downloadManuscript);

module.exports = router;