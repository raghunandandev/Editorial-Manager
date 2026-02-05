const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AuthProvider = require('../models/AuthProvider');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

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

exports.orcidLinkRedirect = (req, res) => {
  try {
    const base = config.ORCID_BASE_URL.replace(/\/$/, '');
    const clientId = config.ORCID_CLIENT_ID;
    const redirectUri = config.ORCID_REDIRECT_URI || `${config.SERVER_ROOT_URL}/api/auth/orcid/callback`;
    if (!clientId) throw new Error('ORCID_CLIENT_ID not configured');

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
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.orcidUnlink = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.orcidId = undefined;
    user.orcidVerified = false;
    if (user.provider === 'orcid') user.provider = 'local';
    await user.save();

    res.json({ success: true, message: 'ORCID unlinked' });
  } catch (err) {
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

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

    try {
      await AuthProvider.create({ userId: user._id, provider: 'email', providerId: user.email, email: user.email });
    } catch (e) {
    }

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

    const token = user.generateAuthToken();
    try {
      await AuthProvider.findOneAndUpdate(
        { provider: 'email', providerId: user.email },
        { $setOnInsert: { userId: user._id, email: user.email } },
        { upsert: true }
      );
    } catch (e) {
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
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const providers = await AuthProvider.find({ userId: req.user.id }).lean();
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.orcidCallback = async (req, res) => {
  try {
    const state = req.query.state;
    let linkUserId = null;
    if (state) {
      try {
        const decodedState = jwt.verify(state, config.JWT_SECRET);
        linkUserId = decodedState.linkUserId;
      } catch (e) {
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
      email = null;
    }

    let authProv = await AuthProvider.findOne({ provider: 'orcid', providerId: orcidId });
    let user = null;
    if (authProv) {
      user = await User.findById(authProv.userId);
    }

    if (linkUserId) {
      const targetUser = await User.findById(linkUserId);
      if (!targetUser) {
        const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?error=invalid_link&message=${encodeURIComponent('Link target no longer exists')}`;
        return res.redirect(redirectUrl);
      }

      const alreadyLinked = await User.findOne({ orcidId });
      if (alreadyLinked && String(alreadyLinked._id) !== String(targetUser._id)) {
        alreadyLinked.orcidId = undefined;
        alreadyLinked.orcidVerified = false;
        if (alreadyLinked.provider === 'orcid') alreadyLinked.provider = 'local';
        await alreadyLinked.save();
        
        try {
          await AuthProvider.deleteOne({ provider: 'orcid', providerId: orcidId });
        } catch (e) {
        }
      }

      try {
        await AuthProvider.findOneAndUpdate(
          { provider: 'orcid', providerId: orcidId },
          { $set: { userId: targetUser._id, email: email || targetUser.email } },
          { upsert: true }
        );
      } catch (e) {
      }
      
      targetUser.orcidId = orcidId;
      targetUser.orcidVerified = true;
      if (email) targetUser.emailVerified = true;
      if (!targetUser.provider || targetUser.provider === 'local') targetUser.provider = 'orcid';
      await targetUser.save();
      
      const token = targetUser.generateAuthToken();
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?token=${encodeURIComponent(token)}`;
      return res.redirect(redirectUrl);
    }

    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        try {
          await AuthProvider.create({ userId: user._id, provider: 'orcid', providerId: orcidId, email });
        } catch (e) {
        }
        user.orcidVerified = true;
        await user.save();
      }
    }

    if (!user) {
      const names = (tokenResp.name || '').split(' ');
      const firstName = names[0] || 'ORCID';
      const lastName = names.slice(1).join(' ') || 'User';
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
        if (saveErr && saveErr.code === 11000 && saveErr.keyPattern && saveErr.keyPattern.email) {
          const existing = await User.findOne({ email: safeEmail });
          if (existing) {
            user = existing;
            if (!existing.orcidVerified) {
              existing.orcidVerified = true;
              await existing.save();
            }
          } else {
          }
        } else {
          throw saveErr;
        }
      }

      try {
        await AuthProvider.create({ userId: user._id, provider: 'orcid', providerId: orcidId, email: safeEmail });
      } catch (e) {
      }
    } else {
      try {
        await AuthProvider.findOneAndUpdate(
          { provider: 'orcid', providerId: orcidId },
          { $set: { userId: user._id, email }, $setOnInsert: { linkedAt: new Date() } },
          { upsert: true }
        );
      } catch (e) {
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
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/orcid/callback?error=server_error&message=${encodeURIComponent('ORCID authentication failed')}`;
    return res.redirect(redirectUrl);
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const code = req.query.code;
    if (!code) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=missing_code&message=${encodeURIComponent('Missing code from Google')}`;
      return res.redirect(redirectUrl);
    }

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens || !tokens.id_token) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=no_id_token&message=${encodeURIComponent('Failed to obtain id token from Google')}`;
      return res.redirect(redirectUrl);
    }

    const ticket = await oauth2Client.verifyIdToken({ idToken: tokens.id_token, audience: config.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: providerId, email, email_verified, given_name, family_name, name } = payload || {};

    if (!email || !email_verified) {
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=email_not_verified&message=${encodeURIComponent('Google account does not have a verified email')}`;
      return res.redirect(redirectUrl);
    }

    const state = req.query.state;
    let linkUserId = null;
    if (state) {
      try {
        const decodedState = jwt.verify(state, config.JWT_SECRET);
        linkUserId = decodedState.linkUserId;
      } catch (e) {
      }
    }

    let authProv = await AuthProvider.findOne({ provider: 'google', providerId });
    let user = null;
    if (authProv) {
      user = await User.findById(authProv.userId);
    }

    if (linkUserId) {
      const targetUser = await User.findById(linkUserId);
      if (!targetUser) {
        const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=invalid_link&message=${encodeURIComponent('Link target no longer exists')}`;
        return res.redirect(redirectUrl);
      }
      const alreadyLinked = await AuthProvider.findOne({ provider: 'google', providerId });
      if (alreadyLinked && String(alreadyLinked.userId) !== String(targetUser._id)) {
        const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=already_linked&message=${encodeURIComponent('This Google account is already linked to another account')}`;
        return res.redirect(redirectUrl);
      }

      try {
        await AuthProvider.create({ userId: targetUser._id, provider: 'google', providerId, email });
      } catch (e) {
      }
      targetUser.emailVerified = true;
      await targetUser.save();
      const tokenForTarget = targetUser.generateAuthToken();
      const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?token=${encodeURIComponent(tokenForTarget)}`;
      return res.redirect(redirectUrl);
    }

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        try {
          await AuthProvider.create({ userId: user._id, provider: 'google', providerId, email });
          user.emailVerified = true;
          await user.save();
        } catch (e) {
        }
      }
    }

    if (!user) {
      
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
      }
    }

    const token = user.generateAuthToken();
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?token=${encodeURIComponent(token)}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    const redirectUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/auth/google/callback?error=server_error&message=${encodeURIComponent('Google authentication failed')}`;
    return res.redirect(redirectUrl);
  }
};

exports.orcidLinkUrl = (req, res) => {
  try {
    const base = config.ORCID_BASE_URL.replace(/\/$/, '');
    const clientId = config.ORCID_CLIENT_ID;
    const redirectUri = config.ORCID_REDIRECT_URI || `${config.SERVER_ROOT_URL}/api/auth/orcid/callback`;
    if (!clientId) throw new Error('ORCID_CLIENT_ID not configured');

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
    return res.status(500).json({ success: false, message: error.message });
  }
};