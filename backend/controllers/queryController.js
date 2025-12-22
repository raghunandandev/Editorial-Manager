const Query = require('../models/Query');
const User = require('../models/User');
const emailService = require('../services/emailService');

exports.submitQuery = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const payload = {
      name: name || (req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Anonymous'),
      email: email || (req.user ? req.user.email : undefined),
      message: message.trim()
    };

    if (!payload.email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (req.user) payload.user = req.user._id;

    const q = new Query(payload);
    await q.save();

    // Find an Editor-in-Chief to notify
    const editor = await User.findOne({ 'roles.editorInChief': true });
    if (editor && editor.email) {
      await emailService.notifyNewQuery(editor.email, q);
    }

    res.status(201).json({ success: true, message: 'Query submitted', data: { query: q } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting query', error: error.message });
  }
};

exports.getPendingQueries = async (req, res) => {
  try {
    const queries = await Query.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: { queries } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching queries', error: error.message });
  }
};

exports.replyToQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: 'Reply is required' });
    }

    const q = await Query.findById(id);
    if (!q) return res.status(404).json({ success: false, message: 'Query not found' });

    q.reply = reply.trim();
    q.status = 'answered';
    q.repliedBy = req.user ? req.user._id : undefined;
    q.repliedAt = new Date();

    await q.save();

    // Send email back to user
    await emailService.sendQueryReply(q.email, q.reply, q);

    res.json({ success: true, message: 'Reply sent', data: { query: q } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error replying to query', error: error.message });
  }
};

exports.getUserQueries = async (req, res) => {
  try {
    const userId = req.user._id;
    const queries = await Query.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: { queries } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching your queries', error: error.message });
  }
};
