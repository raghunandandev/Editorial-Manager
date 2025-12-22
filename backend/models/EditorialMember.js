// models/EditorialMember.js
// Read-only model for public editorial board members. Do not use for auth/roles.
const mongoose = require('mongoose');

const editorialMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  affiliation: { type: String, trim: true },
  email: { type: String, trim: true },
  expertise: [{ type: String }],
  image: { type: String },
  role: { type: String, enum: ['editor-in-chief','editor','advisory'], default: 'editor' },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EditorialMember', editorialMemberSchema);
