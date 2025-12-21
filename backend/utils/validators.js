// backend/utils/validators.js
const { body } = require('express-validator');
const { isEmail } = require('validator');

// Email validation using validator.js isEmail with custom error message
const emailValidator = () => 
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail();

// Common validation rules for auth routes
const authValidation = {
  register: [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    emailValidator()
  ],
  login: [
    emailValidator(),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

module.exports = { authValidation };