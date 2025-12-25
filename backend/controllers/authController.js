// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AuthProvider = require('../models/AuthProvider');
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

// Protected: Initiate ORCID OAuth for linking (includes signed state)
exports.orcidLinkRedirect = (req, res) => {
  try {
    const base = config.ORCID_BASE_URL.replace(/\/$/, '');
    const clientId = config.ORCID_CLIENT_ID;
    const redirectUri = config.ORCID_REDIRECT_URI || `${config.SERVER_ROOT_URL}/api/auth/orcid/callback`;
    if (!clientId) throw new Error('ORCID_CLIENT_ID not configured');

    // Create a short-lived state token encoding the target user id
    const state = jwt.sign({ linkUserId: req.user.id }, config.JWT_SECRET, { expiresIn: '10m' });

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: '/authenticate',
      redirect_uri: redirectUri,
      state
    });

    const url = `${base}/oauth/authorize?${params.toString()}`;
    return res.redirect(url);
  } catch (error) {
    console.error('ORCID link redirect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Protected: unlink ORCID from the authenticated user's account
exports.orcidUnlink = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.orcidId = undefined;
    user.orcidVerified = false;
    // If provider is only 'orcid', revert to 'local'
    if (user.provider === 'orcid') user.provider = 'local';
    await user.save();

    res.json({ success: true, message: 'ORCID unlinked' });
  } catch (err) {
    console.error('Error unlinking ORCID:', err);
    res.status(500).json({ success: false, message: 'Unable to unlink ORCID' });
  }
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

    // Create auth provider entry for email-based account
    try {
      await AuthProvider.create({ userId: user._id, provider: 'email', providerId: user.email, email: user.email });
    } catch (e) {
      console.warn('Failed to create AuthProvider for email:', e.message);
    }

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
    // Ensure AuthProvider exists for this email login
    try {
      await AuthProvider.findOneAndUpdate(
        { provider: 'email', providerId: user.email },
        { $setOnInsert: { userId: user._id, email: user.email } },
        { upsert: true }
      );
    } catch (e) {
      console.warn('Failed to ensure AuthProvider for email login:', e.message);
    }

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
    const user = await User.findById(req.user.id).lean();
    // Include linked providers
    const providers = await AuthProvider.find({ userId: req.user.id }).lean();
    // Attach ORCID info (email/id) for convenience. Prefer provider data, then fall
    // back to values stored on the user document where sensible.
    const orcidProv = providers.find(p => p.provider === 'orcid');
    let orcidEmail = orcidProv?.email || null;
    const orcidId = orcidProv?.providerId || user.orcidId || null;
    if (!orcidEmail && user.email && !user.email.endsWith('@orcid.invalid')) {
      orcidEmail = user.email;
    }

    res.json({
      success: true,
      data: { user: { ...user, providers, orcidEmail, orcidId } }
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

// Protected: Initiate Google OAuth for linking to logged-in user (includes signed state)
exports.googleLinkRedirect = (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const state = jwt.sign({ linkUserId: req.user.id }, config.JWT_SECRET, { expiresIn: '10m' });
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'email', 'profile'],
      state
    });
    return res.redirect(url);
  } catch (error) {
    console.error('Google link redirect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Initiate ORCID OAuth (Authorization Code Flow)
exports.orcidRedirect = (req, res) => {
  try {
    const base = config.ORCID_BASE_URL.replace(/\/$/, '');
    const clientId = config.ORCID_CLIENT_ID;
    const redirectUri = config.ORCID_REDIRECT_URI || `${config.SERVER_ROOT_URL}/api/auth/orcid/callback`;
    if (!clientId) throw new Error('ORCID_CLIENT_ID not configured');

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: '/authenticate',
      redirect_uri: redirectUri
    });

    const url = `${base}/oauth/authorize?${params.toString()}`;
    return res.redirect(url);
  } catch (error) {
    console.error('ORCID redirect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ORCID callback: exchange code for token, obtain ORCID iD, create or link user
exports.orcidCallback = async (req, res) => {
  try {
    // If state is present, it may indicate a linking flow (signed JWT created by server)
    const state = req.query.state;
    let linkUserId = null;
    if (state) {
      try {
        const decodedState = jwt.verify(state, config.JWT_SECRET);
        linkUserId = decodedState.linkUserId;
      } catch (e) {
        // Invalid state token - ignore and continue normal flow
        console.warn('Invalid ORCID state token for linking:', e.message);
      }
    }

    const code = req.query.code;
    const base = config.ORCID_BASE_URL.replace(/\/$/, '');
    const tokenUrl = `${base}/oauth/token`;
    const clientId = config.ORCID_CLIENT_ID;
    const clientSecret = config.ORCID_CLIENT_SECRET;
    const redirectUri = config.ORCID_REDIRECT_URI || `${config.SERVER_ROOT_URL}/api/auth/orcid/callback`;

    if (!code) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?error=missing_code&message=${encodeURIComponent('Missing code from ORCID')}`;
      return res.redirect(redirectUrl);
    }

    // Exchange code for token using built-in https
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const fetchToken = () => {
      return new Promise((resolve, reject) => {
        const https = require('https');
        const opts = new URL(tokenUrl);
        const postData = params.toString();

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const reqPost = https.request(opts, requestOptions, (resPost) => {
          let data = '';
          resPost.on('data', chunk => data += chunk);
          resPost.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              reject(new Error('Failed to parse ORCID token response'));
            }
          });
        });

        reqPost.on('error', (err) => reject(err));
        reqPost.write(postData);
        reqPost.end();
      });
    };

    const tokenResp = await fetchToken();
    if (!tokenResp || !tokenResp.orcid) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?error=no_orcid&message=${encodeURIComponent('Failed to obtain ORCID id')}`;
      return res.redirect(redirectUrl);
    }

    const orcidId = tokenResp.orcid;
    const accessToken = tokenResp.access_token;

    // Try to get emails from ORCID API (may require appropriate scopes)
    let email = null;
    try {
      if (accessToken) {
        const https = require('https');
        const personUrl = `${base}/v2.1/${orcidId}/person`;
        email = await new Promise((resolve) => {
          const opts = new URL(personUrl);
          const reqGet = https.request(opts, { headers: { Authorization: `Bearer ${accessToken}` } }, (resGet) => {
            let body = '';
            resGet.on('data', c => body += c);
            resGet.on('end', () => {
              try {
                const p = JSON.parse(body);
                const emails = p?.emails?.email || [];
                const primary = emails.find(e => e.primary) || emails[0];
                resolve(primary?.email);
              } catch (e) {
                resolve(null);
              }
            });
          });
          reqGet.on('error', () => resolve(null));
          reqGet.end();
        });
      }
    } catch (e) {
      // ignore email fetch errors
      email = null;
    }

    // Find by AuthProvider first
    let authProv = await AuthProvider.findOne({ provider: 'orcid', providerId: orcidId });
    let user = null;
    if (authProv) {
      user = await User.findById(authProv.userId);
    }

    // If linking flow was initiated, prefer linking to that user
    if (linkUserId) {
      const targetUser = await User.findById(linkUserId);
      if (!targetUser) {
        const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?error=invalid_link&message=${encodeURIComponent('Link target no longer exists')}`;
        return res.redirect(redirectUrl);
      }

      // If ORCID exists elsewhere, optionally unlink it from old user and link to target
      const alreadyLinked = await User.findOne({ orcidId });
      if (alreadyLinked && String(alreadyLinked._id) !== String(targetUser._id)) {
        // Unlink from old user
        alreadyLinked.orcidId = undefined;
        alreadyLinked.orcidVerified = false;
        if (alreadyLinked.provider === 'orcid') alreadyLinked.provider = 'local';
        await alreadyLinked.save();
        
        // Remove old AuthProvider record if any
        try {
          await AuthProvider.deleteOne({ provider: 'orcid', providerId: orcidId });
        } catch (e) {
          // ignore
        }
      }

      // Link ORCID to targetUser via AuthProvider (create or update)
      try {
        await AuthProvider.findOneAndUpdate(
          { provider: 'orcid', providerId: orcidId },
          { $set: { userId: targetUser._id, email: email || targetUser.email } },
          { upsert: true }
        );
      } catch (e) {
        // ignore duplicate key errors
      }
      
      // Update target user with ORCID
      targetUser.orcidId = orcidId;
      targetUser.orcidVerified = true;
      // If email was obtained from ORCID, assume it's verified (ORCID only returns verified emails)
      if (email) targetUser.emailVerified = true;
      if (!targetUser.provider || targetUser.provider === 'local') targetUser.provider = 'orcid';
      await targetUser.save();
      
      const token = targetUser.generateAuthToken();
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?token=${encodeURIComponent(token)}`;
      return res.redirect(redirectUrl);
    }

    // If not found via provider, try by email and link
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        try {
          await AuthProvider.create({ userId: user._id, provider: 'orcid', providerId: orcidId, email });
        } catch (e) {
          // ignore duplicate
        }
        user.orcidVerified = true;
        await user.save();
      }
    }

    if (!user) {
      // Create new user - fill required fields minimally
      const names = (tokenResp.name || '').split(' ');
      const firstName = names[0] || 'ORCID';
      const lastName = names.slice(1).join(' ') || 'User';
      // If email not available, create a synthetic email to satisfy schema
      const safeEmail = email || `${orcidId.replace(/[^a-zA-Z0-9]/g, '')}@orcid.invalid`;

      user = new User({
        firstName,
        lastName,
        email: safeEmail,
        provider: 'orcid',
        providerId: orcidId,
        orcidVerified: true
      });

      try {
        await user.save();
      } catch (saveErr) {
        // Handle duplicate email race: if a user with this synthetic email already exists,
        // use that existing user instead and continue linking.
        if (saveErr && saveErr.code === 11000 && saveErr.keyPattern && saveErr.keyPattern.email) {
          const existing = await User.findOne({ email: safeEmail });
          if (existing) {
            user = existing;
            // Ensure ORCID verification is set
            if (!existing.orcidVerified) {
              existing.orcidVerified = true;
              await existing.save();
            }
          } else {
            throw saveErr; // rethrow if we can't resolve
          }
        } else {
          throw saveErr;
        }
      }

      try {
        await AuthProvider.create({ userId: user._id, provider: 'orcid', providerId: orcidId, email: safeEmail });
      } catch (e) {
        // ignore duplicate provider errors
      }
    } else {
      // Ensure AuthProvider exists
      try {
        await AuthProvider.findOneAndUpdate(
          { provider: 'orcid', providerId: orcidId },
          { $set: { userId: user._id, email }, $setOnInsert: { linkedAt: new Date() } },
          { upsert: true }
        );
      } catch (e) {
        // ignore
      }
      if (!user.orcidVerified) {
        user.orcidVerified = true;
        await user.save();
      }
    }

    const token = user.generateAuthToken();
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?token=${encodeURIComponent(token)}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('ORCID OAuth error:', error);
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?error=server_error&message=${encodeURIComponent('ORCID authentication failed')}`;
    return res.redirect(redirectUrl);
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

    // Inspect state to detect linking flow
    const state = req.query.state;
    let linkUserId = null;
    if (state) {
      try {
        const decodedState = jwt.verify(state, config.JWT_SECRET);
        linkUserId = decodedState.linkUserId;
      } catch (e) {
        console.warn('Invalid Google state token for linking:', e.message);
      }
    }

    // Try to find existing AuthProvider record for this Google account
    let authProv = await AuthProvider.findOne({ provider: 'google', providerId });
    let user = null;
    if (authProv) {
      user = await User.findById(authProv.userId);
      console.log('[Google OAuth] Found auth provider -> user', { providerId, userId: authProv.userId });
    }

    // If linking flow, attach to linkUserId (with checks)
    if (linkUserId) {
      const targetUser = await User.findById(linkUserId);
      if (!targetUser) {
        const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=invalid_link&message=${encodeURIComponent('Link target no longer exists')}`;
        return res.redirect(redirectUrl);
      }
      // Prevent duplicate provider linking
      const alreadyLinked = await AuthProvider.findOne({ provider: 'google', providerId });
      if (alreadyLinked && String(alreadyLinked.userId) !== String(targetUser._id)) {
        const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=already_linked&message=${encodeURIComponent('This Google account is already linked to another account')}`;
        return res.redirect(redirectUrl);
      }

      // Link provider to targetUser
      try {
        await AuthProvider.create({ userId: targetUser._id, provider: 'google', providerId, email });
      } catch (e) {
        // ignore duplicate
      }
      targetUser.emailVerified = true;
      await targetUser.save();
      const tokenForTarget = targetUser.generateAuthToken();
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?token=${encodeURIComponent(tokenForTarget)}`;
      return res.redirect(redirectUrl);
    }

    // If no AuthProvider, try to find by verified email and link provider to that user
    if (!user) {
      user = await User.findOne({ email });
      console.log('[Google OAuth] Searched by email:', { email, found: !!user });
      if (user) {
        try {
          await AuthProvider.create({ userId: user._id, provider: 'google', providerId, email });
          user.emailVerified = true;
          await user.save();
          console.log('[Google OAuth] Linked google provider to existing user', { userId: user._id });
        } catch (e) {
          console.warn('Could not create AuthProvider for existing user:', e.message);
        }
      }
    }

    // If still no user, create a new User and AuthProvider
    if (!user) {
      console.log('[Google OAuth] Creating new user for google login', { email });
      const [firstName, ...rest] = (given_name || name || '').split(' ');
      const lastName = family_name || rest.join(' ') || '';

      user = new User({
        firstName: firstName || 'Google',
        lastName: lastName || 'User',
        email,
        provider: 'google',
        providerId,
        emailVerified: true
      });
      await user.save();
      try {
        await AuthProvider.create({ userId: user._id, provider: 'google', providerId, email });
      } catch (e) {
        console.warn('Failed to create google AuthProvider for new user:', e.message);
      }
      console.log('[Google OAuth] User created:', { userId: user._id, email });
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

// Protected: return ORCID OAuth authorize URL (for client-side redirect)
exports.orcidLinkUrl = (req, res) => {
  try {
    const base = config.ORCID_BASE_URL.replace(/\/$/, '');
    const clientId = config.ORCID_CLIENT_ID;
    const redirectUri = config.ORCID_REDIRECT_URI || `${config.SERVER_ROOT_URL}/api/auth/orcid/callback`;
    if (!clientId) throw new Error('ORCID_CLIENT_ID not configured');

    // Create a short-lived state token encoding the target user id
    const state = jwt.sign({ linkUserId: req.user.id }, config.JWT_SECRET, { expiresIn: '10m' });

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: '/authenticate',
      redirect_uri: redirectUri,
      state
    });

    const url = `${base}/oauth/authorize?${params.toString()}`;
    return res.json({ success: true, url });
  } catch (error) {
    console.error('ORCID link URL error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};