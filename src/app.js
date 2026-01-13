const express = require('express');
const app = express();
const globalErrorHandler = require('./middlewares/globalErrorHandler')

app.use(express.json());
app.use(globalErrorHandler);

app.get('/', (req, res) => {
    res.send('Backend project is working correctly');
})
module.exports = app;