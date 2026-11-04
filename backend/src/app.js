/**
 * Express Application Setup
 * Author: Suchitra (Backend & Database Developer)
 */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const config = require('./config/env');
const configureSecurity = require('./middleware/security');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');
const ApiResponse = require('./utils/apiResponse');

const app = express();

app.set('trust proxy', config.trustProxyHops);

// 1. Security (Helmet + CORS)
configureSecurity(app);

// 2. Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// 3. Body parsers with rawBody preservation for webhooks
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

// 4. Rate limiting for all incoming traffic
app.use(generalLimiter);

// 5. Static file serving for uploads (project images, documents)
app.use('/uploads', express.static(config.uploadDir));

// 6. Root status check
app.get('/', (req, res) => {
  return ApiResponse.success(res, 'Welcome to Saraswati Educational & Charitable Trust (SECT) API', {
    version: '1.0.0',
    docs: '/docs/API.md',
    health: '/api/v1/health'
  });
});

// 7. Mount Central API Routes
app.use('/api/v1', apiRoutes);

// 8. 404 Handler
app.use((req, res) => {
  return ApiResponse.error(res, `Route not found: ${req.method} ${req.originalUrl}`, [], 404);
});

// 9. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
