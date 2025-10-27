const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../.env' });

const performanceRoutes = require('./routes/performance');
const stateRoutes = require('./routes/states');
const districtRoutes = require('./routes/districts');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB with graceful fallback
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.warn('⚠️ MongoDB connection failed, will use mock data:', error.message);
  console.log('🔄 Server will continue running with mock data service');
});

// Routes
app.use('/api/performance', performanceRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'MGNREGA Dashboard API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bharat, - MGNREGA Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      states: '/api/states',
      districts: '/api/districts/:state',
      performance: '/api/performance/:state/:district',
      comparison: '/api/performance/compare'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` MGNREGA Dashboard API ready at http://localhost:${PORT}`);
});

module.exports = app;