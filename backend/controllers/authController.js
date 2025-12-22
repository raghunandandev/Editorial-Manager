// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

// Helper to get/create OAuth2 client (lazy initialization ensures config is loaded)
const getOAuth2Client = () => {
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
  }
  return new OAuth2Client(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    `${config.SERVER_ROOT_URL}/api/auth/google/callback`
  );
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, affiliation, country } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user (default role: author)
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      profile: {
        affiliation,
        country
      }
    });

    await user.save();

    // Generate token
    //const token = generateToken(user._id);

    // res.status(201).json({
    //   success: true,
    //   message: 'User registered successfully',
    //   data: {
    //     user: {
    //       id: user._id,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       email: user.email,
    //       roles: user.roles
    //     },
    //     token
    //   }
    // });
    const token = user.generateAuthToken();
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { email, password } = req.body;

//     // Find user and include password for comparison
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Check password
//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Generate token
//     const token = generateToken(user._id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: {
//           id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           roles: user.roles
//         },
//         token
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login',
//       error: error.message
//     });
//   }
// };

// In backend/controllers/authController.js
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // const token = user.generateAuthToken();
    
    // res.json({
    //   success: true,
    //   data: {
    //     token,
    //     user: {
    //       id: user._id,
    //       email: user.email,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       roles: user.roles
    //     }
    //   }
    // });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    // Generate token
    const token = user.generateAuthToken();
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Initiate Google OAuth (redirects to Google's consent screen)
exports.googleRedirect = (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'email', 'profile']
    });
    return res.redirect(url);
  } catch (error) {
    console.error('Google OAuth redirect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Google OAuth callback (exchanges code, verifies id token, creates/logs-in user)
exports.googleCallback = async (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const code = req.query.code;
    if (!code) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=missing_code&message=${encodeURIComponent('Missing code from Google')}`;
      return res.redirect(redirectUrl);
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens || !tokens.id_token) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=no_id_token&message=${encodeURIComponent('Failed to obtain id token from Google')}`;
      return res.redirect(redirectUrl);
    }

    // Verify ID token and extract payload
    const ticket = await oauth2Client.verifyIdToken({ idToken: tokens.id_token, audience: config.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: providerId, email, email_verified, given_name, family_name, name } = payload || {};

    console.log('[Google OAuth] Verified payload:', { providerId, email, email_verified, given_name, family_name });

    // Require a verified email
    if (!email || !email_verified) {
      console.warn('[Google OAuth] Email not verified:', email);
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=email_not_verified&message=${encodeURIComponent('Google account does not have a verified email')}`;
      return res.redirect(redirectUrl);
    }

    // Check if user exists by providerId first (most reliable for Google OAuth)
    let user = await User.findOne({ provider: 'google', providerId });
    console.log('[Google OAuth] Searched by providerId:', { providerId, found: !!user });
    
    // If not found by providerId, check by email
    if (!user) {
      user = await User.findOne({ email });
      console.log('[Google OAuth] Searched by email:', { email, found: !!user, provider: user?.provider });
    }

    // If there's an existing local account (password-based) with same email, do not auto-link
    if (user && user.provider !== 'google' && user.password) {
      console.warn('[Google OAuth] Account exists with different provider:', { email, provider: user.provider });
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=account_exists&message=${encodeURIComponent('An account with this email already exists. Please login using email and password.')}`;
      return res.redirect(redirectUrl);
    }

    // Create new OAuth user only if not found by either providerId or email
    if (!user) {
      console.log('[Google OAuth] Creating new user:', { email, provider: 'google' });
      // Create new OAuth user (no password)
      const [firstName, ...rest] = (given_name || name || '').split(' ');
      const lastName = family_name || rest.join(' ') || '';

      user = new User({
        firstName: firstName || 'Google',
        lastName: lastName || 'User',
        email,
        provider: 'google',
        providerId,
        // No password for OAuth users
      });

      await user.save();
      console.log('[Google OAuth] User created:', { userId: user._id, email });
    } else {
      console.log('[Google OAuth] Existing user found:', { userId: user._id, email });
    }

    // Generate token using existing mechanism
    const token = user.generateAuthToken();
    console.log('[Google OAuth] Token generated:', { userId: user._id, tokenLength: token.length });

    // Redirect back to frontend with token as query param
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?token=${encodeURIComponent(token)}`;
    console.log('[Google OAuth] Redirecting to:', redirectUrl.substring(0, 80) + '...');
    return res.redirect(redirectUrl);
    } catch (error) {
    console.error('Google OAuth error:', error);
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=server_error&message=${encodeURIComponent('Google authentication failed')}`;
    return res.redirect(redirectUrl);
  }
};