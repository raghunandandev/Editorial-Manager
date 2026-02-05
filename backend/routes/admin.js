const express = require('express');
const { body } = require('express-validator');
const {
  getDashboardStats,
  getPendingManuscripts,
  assignReviewer,
  updateUserRoles,
  setManuscriptStatus
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(auth, authorize('editorInChief'));

router.get('/dashboard', getDashboardStats);
router.get('/pending-manuscripts', getPendingManuscripts);
router.get('/payments', require('../controllers/adminController').getPayments);
router.post('/assign-reviewer', [
  body('manuscriptId').isMongoId().withMessage('Valid manuscript ID is required'),
  body('reviewerId').isMongoId().withMessage('Valid reviewer ID is required'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  validate
], assignReviewer);
router.post('/manuscripts/:id/editor-decision', [
  body('decision').isIn(['accept','reject']).withMessage('Decision must be accept or reject'),
  validate
], require('../controllers/adminController').editorDecision);

router.post('/manuscripts/:id/request-payment', require('../controllers/adminController').requestPayment);
router.patch('/user-roles', updateUserRoles);
router.patch('/manuscripts/:id/status', [
  body('status')
    .isIn(['submitted', 'under_review', 'revisions_required', 'accepted', 'rejected', 'published', 'selected'])
    .withMessage('Invalid status provided'),
  validate
], setManuscriptStatus);

module.exports = router;