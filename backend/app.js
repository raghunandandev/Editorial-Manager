const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');

const authRoutes = require('./routes/auth');
const manuscriptRoutes = require('./routes/manuscript');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');
const queryRoutes = require('./routes/queries');
const editorialRoutes = require('./routes/editorial');
const editorProfileRoutes = require('./routes/editorProfile');
const paymentRoutes = require('./routes/payment');

const app = express();

app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {})
.catch(err => {});

app.use('/api/auth', authRoutes);
app.use('/api/manuscripts', manuscriptRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', editorialRoutes);
app.use('/api', editorProfileRoutes);

const authController = require('./controllers/authController');
app.get('/api/orcid/callback', authController.orcidCallback);
app.get('/api/orcid', authController.orcidRedirect);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: config.NODE_ENV === 'production' ? {} : err.message
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;