// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  provider: {
    type: String,
    enum: ['google', 'local', 'orcid', null],
    default: 'local'
  },
  providerId: {
    type: String
  },
  // ORCID fields (optional)
  orcidId: {
    type: String
  },
  orcidVerified: {
    type: Boolean,
    default: false
  },
  // Whether the user's email has been verified (e.g., via Google OAuth)
  emailVerified: {
    type: Boolean,
    default: false
  },
  roles: {
    author: { type: Boolean, default: true },
    reviewer: { type: Boolean, default: false },
    editor: { type: Boolean, default: false },
    editorInChief: { type: Boolean, default: false }
  },
  profile: {
    affiliation: String,
    country: String,
    expertise: [String],
    orcid: String,
    bio: String,
    image: String,
    title: String,
    department: String,
    website: String,
    phone: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      researchGate: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET || '8fsd8FDSF',
    { expiresIn: '30d' }
  );
};

userSchema.methods.hasRole = function(role) {
  return this.roles[role] === true;
};

module.exports = mongoose.model('User', userSchema);
