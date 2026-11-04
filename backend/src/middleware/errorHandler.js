/**
 * Centralized Error Handling Middleware
 * Strictly adheres to Section 12 & 27 of ANTIGRAVITY_TEAM_RULES.md
 * Author: Suchitra (Backend & Database Developer)
 */

const logger = require('../config/logger');
const config = require('../config/env');
const ApiResponse = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(`[Unhandled Error] ${req.method} ${req.originalUrl}: ${err.message}`, err);

  if (err.type === 'entity.parse.failed') {
    return ApiResponse.error(res, 'Request body contains invalid JSON.', [], 400);
  }

  if (err.type === 'entity.too.large') {
    return ApiResponse.error(res, 'Request body is too large.', [], 413);
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    const errors = config.nodeEnv === 'production' ? [] : [{ detail: err.detail }];
    return ApiResponse.error(res, 'A record with this unique value already exists.', errors, 409);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    const errors = config.nodeEnv === 'production' ? [] : [{ detail: err.detail }];
    return ApiResponse.error(res, 'Referenced record does not exist.', errors, 400);
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    return ApiResponse.error(res, `Upload error: ${err.message}`, [{ code: err.code }], 400);
  }

  const requestedStatus = err.statusCode || err.status;
  const statusCode = Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus <= 599
    ? requestedStatus
    : (res.statusCode >= 400 && res.statusCode <= 599 ? res.statusCode : 500);
  const message = err.isOperational || config.nodeEnv !== 'production'
    ? err.message
    : 'Internal server error. Please try again later.';

  const errors = config.nodeEnv !== 'production' && err.stack
    ? [{ message: err.message, stack: err.stack }]
    : [{ message }];

  return ApiResponse.error(res, message, errors, statusCode);
}

module.exports = errorHandler;
