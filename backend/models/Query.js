const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' },
  reply: { type: String },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repliedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
