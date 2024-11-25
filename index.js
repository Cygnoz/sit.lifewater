const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./db/connection'); 

// Import routes
const stockRoutes = require('./routes/router.js'); 


// app.use(cors({
//   origin: 'http://3.110.171.51:4173'
// }));

app.use(cors())
app.use(express.json());

// Routes
app.use(stockRoutes); 


// Test route
app.get('/', (req, res) => {
  res.status(200).json('Life Water server started - Stock');
});

// Server listen
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Life Water - Stock Server is running on port ${PORT}`);
});
