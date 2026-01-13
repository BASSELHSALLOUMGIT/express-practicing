const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler')

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
    res.send('Backend project is working correctly');
});

module.exports = app;