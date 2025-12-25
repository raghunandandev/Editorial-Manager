// models/AuthProvider.js
const mongoose = require('mongoose');

const authProviderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  provider: { type: String, enum: ['email', 'google', 'orcid'], required: true },
  providerId: { type: String, required: true },
  email: { type: String },
  linkedAt: { type: Date, default: Date.now }
}, { timestamps: true });

authProviderSchema.index({ provider: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('AuthProvider', authProviderSchema);
