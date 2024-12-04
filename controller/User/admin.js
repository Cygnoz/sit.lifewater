const bcrypt = require('bcrypt');
const Admin = require("../../Models/admin");
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');




exports.addAdmin = async (req, res) => {
    try {
      console.log("Add Admin:", req.body);
  
      const cleanedData = cleanCustomerData(req.body);
  
      const { username, password  } = cleanedData;
  
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin username already exists.' });
      }

      cleanedData.password = await bcrypt.hash(password,10);

      const newAdmin = new Admin({ ...cleanedData });        
  
      // Save the staff record
      const savedAdmin = await newAdmin.save();
      console.log("Admin Saved Successfully",savedAdmin);
      return res.status(201).json(savedAdmin);    
        
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };






  const loginRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 5, // limit each IP to 5 login requests per windowMs
    handler: (req, res) => {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts, please try again after 1 minute',
      });
    },
  });


  // Login 
exports.login = [loginRateLimiter, async (req, res) => {
    try {
      // Get all data
      const { username, password } = req.body;    
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both username and password' });
      }
  
      // Find the user
      const user = await Admin.findOne({ username });
  
      // Check if user exists
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found!' });
      }

      // Match the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid Password!' });
      }


      else {
        const token = jwt.sign(
          {
            id: user._id,
            userName: user.username,

          },
          process.env.JWT_SECRET, 
          { expiresIn: '12h' }
        );
  
        // Send response with user data (excluding organizationId)
        console.log(`${username} logged in successfully`);
        
        res.status(200).json({
          success: true,
          token: `Bearer ${token}`
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }];
  
  
















  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }