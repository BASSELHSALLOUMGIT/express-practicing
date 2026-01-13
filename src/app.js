const express = require('express');
const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Backend project is working correctly');
})
module.exports = app;