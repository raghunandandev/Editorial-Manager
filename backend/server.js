const app = require('./app');
const config = require('./config/env');
const cors = require('cors');

require('events').EventEmitter.defaultMaxListeners = 15;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});