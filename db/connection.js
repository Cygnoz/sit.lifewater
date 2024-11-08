const mongoose = require('mongoose');
require('dotenv').config();

// Replace with your MongoDB connection string from the .env file
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });