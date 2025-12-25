// // routes/auth.js
// const express = require('express');
// const { body } = require('express-validator');
// const { register, login, getProfile } = require('../controllers/authController');
// const { auth } = require('../middleware/auth');

// const router = express.Router();

// router.post('/register', [
//   body('firstName').notEmpty().withMessage('First name is required'),
//   body('lastName').notEmpty().withMessage('Last name is required'),
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// ], register);

// router.post('/login', [
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').notEmpty().withMessage('Password is required')
// ], login);
 
// router.get('/profile', auth, getProfile);

// module.exports = router;


// backend/routes/auth.js
const express = require('express');
const { authValidation } = require('../utils/validators');
const { register, login, getProfile, googleRedirect, googleCallback, googleLinkRedirect, orcidRedirect, orcidCallback, orcidLinkRedirect, orcidUnlink, orcidLinkUrl } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authValidation.register, register);
router.post('/login', authValidation.login, login);
router.get('/profile', auth, getProfile);

// Google OAuth routes (server-side flow)
router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);
// Protected Google linking route
router.get('/google/link', auth, googleLinkRedirect);

// ORCID OAuth routes
router.get('/orcid', orcidRedirect);
router.get('/orcid/callback', orcidCallback);
// Protected linking/unlinking endpoints
router.get('/orcid/link', auth, orcidLinkRedirect);
router.get('/orcid/link-url', auth, orcidLinkUrl);
router.post('/orcid/unlink', auth, orcidUnlink);

module.exports = router;