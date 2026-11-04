/**
 * Security Middleware (Helmet, CORS)
 * Author: Suchitra (Backend & Database Developer)
 */

const helmet = require('helmet');
const cors = require('cors');
const config = require('../config/env');

const allowedOrigins = [config.frontendUrl];
if (config.nodeEnv !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || config.nodeEnv !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy does not allow access from the specified Origin.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

function configureSecurity(app) {
  // Helmet HTTP security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' } // Allows frontend to render uploaded images
  }));

  // CORS
  app.use(cors(corsOptions));
}

module.exports = configureSecurity;
