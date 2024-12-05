const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./db/connection'); 

// Import routes
const orderRoutes = require('./routes/router.js'); 

app.use(cors())
app.use(express.json());

// Routes
app.use(orderRoutes); 


// Test route
app.get('/', (req, res) => {
  res.status(200).json('Life Water server started - Order(v 1.0)');
});

// Server listen
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Life Water - Order Server is running on port ${PORT}`);
});
