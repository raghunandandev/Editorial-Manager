const express = require('express');
const { body } = require('express-validator');
const { verifyPayment } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Payment provider will call server-side verification endpoint
router.post('/verify', [
  auth,
  body('manuscriptId').isMongoId(),
  body('paymentId').notEmpty(),
  body('amount').isNumeric(),
  body('status').notEmpty(),
  validate
], verifyPayment);

// Create Razorpay order for client-side checkout
router.post('/create-order', [
  auth,
  body('manuscriptId').isMongoId(),
  validate
], require('../controllers/paymentController').createOrder);

module.exports = router;
