/**
 * JWT Authentication Middleware
 * Author: Suchitra (Backend & Database Developer)
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiResponse = require('../utils/apiResponse');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Authentication token missing or invalid format', [{ message: 'Bearer token required' }], 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Access token has expired', [{ code: 'TOKEN_EXPIRED', message: 'Token expired' }], 401);
    }
    return ApiResponse.error(res, 'Invalid authentication token', [{ code: 'TOKEN_INVALID', message: 'Token verification failed' }], 401);
  }
}

/**
 * Optional authentication (attaches user if token present, does not block if omitted)
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, config.jwt.secret);
    } catch {
      // ignore optional auth errors
    }
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth
};
