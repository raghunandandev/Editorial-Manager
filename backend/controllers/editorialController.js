const User = require('../models/User');
exports.getEditorialBoard = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ 'roles.editor': true }, { 'roles.editorInChief': true }]
    }).select('firstName lastName email roles profile').lean();

    const members = users.map(user => ({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      affiliation: user.profile?.affiliation || '',
      email: user.email,
      expertise: user.profile?.expertise || [],
      image: user.profile?.image || '',
      role: user.roles.editorInChief ? 'editor-in-chief' : 'editor'
    }));

    const editorsInChief = members.filter(m => m.role === 'editor-in-chief');
    const editors = members.filter(m => m.role === 'editor');

    res.json({ success: true, data: { editorsInChief, editors } });
  } catch (err) {
    console.error('Error fetching editorial board:', err);
    res.status(500).json({ success: false, message: 'Unable to fetch editorial board' });
  }
};
