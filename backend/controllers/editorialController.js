// controllers/editorialController.js
// Public controller to expose editorial board data from authenticated User roles (read-only, public fields only)
const User = require('../models/User');

// GET /api/editorial-board
exports.getEditorialBoard = async (req, res) => {
  try {
    // Fetch users with editor or editorInChief roles; return only public profile fields
    const users = await User.find({
      $or: [{ 'roles.editor': true }, { 'roles.editorInChief': true }]
    }).select('firstName lastName email roles profile').lean();

    // Map User fields to editorial board shape
    const members = users.map(user => ({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      affiliation: user.profile?.affiliation || '',
      email: user.email,
      expertise: user.profile?.expertise || [],
      image: user.profile?.image || '',
      role: user.roles.editorInChief ? 'editor-in-chief' : 'editor'
    }));

    // Distinguish editor-in-chief (as array) and editors (as array)
    const editorsInChief = members.filter(m => m.role === 'editor-in-chief');
    const editors = members.filter(m => m.role === 'editor');

    res.json({ success: true, data: { editorsInChief, editors } });
  } catch (err) {
    console.error('Error fetching editorial board:', err);
    res.status(500).json({ success: false, message: 'Unable to fetch editorial board' });
  }
};
