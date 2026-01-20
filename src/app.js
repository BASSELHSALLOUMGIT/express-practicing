const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const globalRateLimiter = require('./middlewares/globalRateLimiter');

app.set('trust proxy', 1);

// Secure HTTP headers
app.use(helmet());

// Limit requests
app.use(globalRateLimiter);

app.use(express.json());

// Prevent XSS
app.use(xss());
// Prevent NoSQL injection
app.use(mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
    res.send('Backend project is working correctly');
});

module.exports = app;