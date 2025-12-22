// Seed script: create an Editor-in-Chief user if not exists
const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');

async function run() {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = process.env.EDITOR_EMAIL || 'eic@example.com';
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      firstName: 'Editor',
      lastName: 'InChief',
      email,
      password: 'password123',
      roles: { author: true, reviewer: false, editor: true, editorInChief: true }
    });
    await user.save();
    console.log('Created Editor-in-Chief:', email);
  } else {
    // ensure role is set
    user.roles = { ...user.roles, editorInChief: true, editor: true };
    await user.save();
    console.log('Updated existing user as Editor-in-Chief:', email);
  }

  console.log('Token:', user.generateAuthToken());
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
