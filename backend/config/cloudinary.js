const cloudinary = require('cloudinary').v2;
const config = require('./env');

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true
});

if (config.CLOUDINARY_CLOUD_NAME && config.CLOUDINARY_API_KEY && config.CLOUDINARY_API_SECRET && config.NODE_ENV !== 'test') {
  cloudinary.api.ping()
    .then(() => console.log('✅ Cloudinary configured successfully'))
    .catch(error => {
      console.error('❌ Cloudinary configuration failed:', (error && error.stack) ? error.stack : JSON.stringify(error));
    });
} else {
  if (config.NODE_ENV === 'test') {
    console.log('Cloudinary ping skipped in test environment');
  } else {
    console.warn('Cloudinary credentials missing; skipping ping');
  }
}

module.exports = cloudinary;