const rateLimit = require('express-rate-limit');

// Configure rate limiter for auth routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,                   // max 5 requests per IP
  message: 'Too many attempts. Please try again later.'
});

module.exports = apiLimiter;