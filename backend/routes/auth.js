const express = require('express');
const { authValidation } = require('../utils/validators');
const { register, login, getProfile, googleRedirect, googleCallback, googleLinkRedirect, orcidRedirect, orcidCallback, orcidLinkRedirect, orcidUnlink, orcidLinkUrl } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authValidation.register, register);
router.post('/login', authValidation.login, login);
router.get('/profile', auth, getProfile);

router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);
router.get('/google/link', auth, googleLinkRedirect);

router.get('/orcid', orcidRedirect);
router.get('/orcid/callback', orcidCallback);
router.get('/orcid/link', auth, orcidLinkRedirect);
router.get('/orcid/link-url', auth, orcidLinkUrl);
router.post('/orcid/unlink', auth, orcidUnlink);

module.exports = router;