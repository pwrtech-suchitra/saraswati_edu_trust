/**
 * Rate Limiting Middleware
 * Author: Suchitra (Backend & Database Developer)
 */

let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch {
  // Graceful fallback if dependency is being installed
  rateLimit = () => (req, res, next) => next();
}

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errors: [{ code: 'RATE_LIMIT_EXCEEDED' }]
  }
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login/register attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    errors: [{ code: 'AUTH_RATE_LIMIT_EXCEEDED' }]
  }
});

// Payment order / verification limiter
const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Payment request limit reached. Please wait before retrying.',
    errors: [{ code: 'PAYMENT_RATE_LIMIT_EXCEEDED' }]
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter
};
