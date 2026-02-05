const express = require('express');
const { body } = require('express-validator');
const { verifyPayment } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post('/verify', [
  auth,
  body('manuscriptId').isMongoId(),
  body('paymentId').notEmpty(),
  body('amount').isNumeric(),
  body('status').notEmpty(),
  validate
], verifyPayment);

router.post('/create-order', [
  auth,
  body('manuscriptId').isMongoId(),
  validate
], require('../controllers/paymentController').createOrder);

module.exports = router;
