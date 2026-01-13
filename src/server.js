require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Backend project is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('DB connection error', err));