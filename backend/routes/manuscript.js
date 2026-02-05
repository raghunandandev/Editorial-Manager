const express = require('express');
const { body } = require('express-validator');
const { 
  submitManuscript, 
  getMyManuscripts, 
  getManuscript,
  downloadManuscript,
  downloadAcceptedManuscript,
  getAcceptedManuscripts,
  submitRevision
} = require('../controllers/manuscriptController');

const { auth, authorize } = require('../middleware/auth');
const requireOrcidVerification = require('../middleware/requireOrcidVerification');
const { upload, handleUploadErrors } = require('../middleware/upload');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/accepted', getAcceptedManuscripts);
router.get('/accepted/:id/download', downloadAcceptedManuscript);
router.get('/published', require('../controllers/manuscriptController').getPublishedManuscripts);
router.get('/published/:id/download', require('../controllers/manuscriptController').downloadPublishedManuscript);

router.post('/submit', 
  [
    auth,
    authorize('author'),
    requireOrcidVerification,
    upload.single('manuscript'),
    body('title').notEmpty().withMessage('Title is required'),
    body('abstract').notEmpty().withMessage('Abstract is required'),
    body('domain').notEmpty().withMessage('Domain is required'),
    validate,
    handleUploadErrors
  ],
  submitManuscript
);

router.get('/my-manuscripts', auth, authorize('author'), getMyManuscripts);
router.get('/:id', auth, getManuscript);
router.get('/:id/download', auth, downloadManuscript);

router.post('/:manuscriptId/submit-revision',
  [
    auth,
    authorize('author'),
    upload.single('revisionFile'),
    body('revisionNotes').optional({ checkFalsy: true }).isString(),
    validate,
    handleUploadErrors
  ],
  submitRevision
);

module.exports = router;