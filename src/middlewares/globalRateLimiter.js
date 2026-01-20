const rateLimit = require('express-rate-limit');

const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status : "error",
        message: "Too many requests, Please try again in 15 minutes"
    }
});

module.exports = globalRateLimiter;