const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
require('./db/connection');

// Import routes
const staffRoutes = require('./routes/router.js'); 
const routeRoute = require('./routes/router.js');
const subrouteRoute = require('./routes/router.js');
const vehicleRoute = require('./routes/router.js');

// Middleware
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = ['http://3.110.171.51:5173', 'http://3.110.171.51:4173','http://localhost:5179'];
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   optionsSuccessStatus: 200,
//   credentials: true, // If using cookies or authorization headers
// };
 
app.use(cors());

// Increase the limit for JSON payloads
app.use(express.json({ limit: '10mb' })); // Set limit to 10MB

// Increase the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// app.use(cors())
app.use(express.json());

app.use('/uploads', express.static('uploads')); // Ensure the path is correct


// Routes
app.use('/api', staffRoutes); // This prefixes all your staff routes with '/api'
app.use('/api', routeRoute);
app.use('/api',vehicleRoute);
app.use('/api',subrouteRoute);

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Life Water - Backend Server is running on port ${PORT}`);
});
