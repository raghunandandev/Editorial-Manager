// server.js
const app = require('./app');
const config = require('./config/env');
const cors = require('cors')


// Increase EventEmitter limit to prevent warning
require('events').EventEmitter.defaultMaxListeners = 15;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}))

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});