module.exports = function requireOrcidVerification(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

    if (!user.roles || !user.roles.author) {
      return res.status(403).json({ success: false, message: 'Only authors may submit manuscripts' });
    }

    if (!user.orcidVerified) {
      return res.status(403).json({ success: false, message: 'ORCID verification is required to submit a manuscript.' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error in ORCID verification middleware' });
  }
};
