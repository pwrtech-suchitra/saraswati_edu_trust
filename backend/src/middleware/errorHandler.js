/**
 * Centralized Error Handling Middleware
 * Strictly adheres to Section 12 & 27 of ANTIGRAVITY_TEAM_RULES.md
 * Author: Suchitra (Backend & Database Developer)
 */

const logger = require('../config/logger');
const config = require('../config/env');
const ApiResponse = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  logger.error(`[Unhandled Error] ${req.method} ${req.originalUrl}: ${err.message}`, err);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return ApiResponse.error(res, 'A record with this unique value already exists.', [{ detail: err.detail }], 409);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return ApiResponse.error(res, 'Referenced record does not exist.', [{ detail: err.detail }], 400);
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    return ApiResponse.error(res, `Upload error: ${err.message}`, [{ code: err.code }], 400);
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.isOperational || config.nodeEnv !== 'production'
    ? err.message
    : 'Internal server error. Please try again later.';

  const errors = config.nodeEnv !== 'production' && err.stack
    ? [{ message: err.message, stack: err.stack }]
    : [{ message }];

  return ApiResponse.error(res, message, errors, statusCode);
}

module.exports = errorHandler;
