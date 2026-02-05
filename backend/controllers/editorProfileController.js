const User = require('../models/User');
exports.getEditorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -provider -providerId').lean();
    
    if (!user || (!user.roles.editor && !user.roles.editorInChief)) {
      return res.status(404).json({ success: false, message: 'Editor not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error fetching editor profile:', err);
    res.status(500).json({ success: false, message: 'Unable to fetch profile' });
  }
};

exports.updateEditorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (userId !== id && !req.user?.roles?.editorInChief) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const allowedFields = ['profile'];
    const updates = {};
    
    if (req.body.profile) {
      updates.profile = req.body.profile;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Unable to update profile' });
  }
};
