const Staff = require("../../Models/StaffSchema");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { log } = require("console");
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); 
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf8'); 
const ride = require("../../Models/ride");



// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    if(staff.password){
      staff.password = decrypt(staff.password);
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.addStaff = async (req, res) => {
  try {
    console.log("Add Staff:", req.body);

    const cleanedData = cleanCustomerData(req.body);

    const { mobileNumber, designation, username, password  } = cleanedData;

    if (!cleanedData.firstname) {
      return res.status(400).json({ message: 'First Name is required' });
    }
    if (!cleanedData.mobileNumber) {
      return res.status(400).json({ message: 'Mobile Number is required' });
    }
    if (!cleanedData.firstname) {
      return res.status(400).json({ message: 'WhatsApp Number is required' });
    }
    if (!cleanedData.designation) {
      return res.status(400).json({ message: 'Designation is required' });
    }


    // Check for existing staff with the same mobile number
    const existingStaff = await Staff.findOne({ mobileNumber });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff member with this mobile number already exists.' });
    }

    // Handle logic specific to "Sales"
    if (designation === 'Sales') {
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for Sales staff.' });
      }
      // Check if username already exists
      const existingSalesStaff = await Staff.findOne({ username });
      if (existingSalesStaff) {
        return res.status(400).json({ message: 'User with this username already exists.' });
      }
      cleanedData.password = encrypt(cleanedData.password);
    }      
      
      // Create the new staff record for "Sales"
      const newStaff = new Staff({ ...cleanedData });
      const savedStaff = await newStaff.save();
      console.log("Staff Saved Successfully",savedStaff);
      res.status(200).json({ 
        message: "Staff created successfully.",
        data: savedStaff,
      });
    
  } catch (error) {
    console.log(error);    
    res.status(500).json({ message: "Internal server error." });
  }
};




exports.editStaff = async (req, res) => {
  try {
    console.log("Edit Staff:", req.body);
    const { id } = req.params;

    const cleanedData = cleanCustomerData(req.body);

    const existingStaff = await Staff.findById(id);
    if (!existingStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const { designation, username, password, mobileNumber } = req.body;

    if (!cleanedData.firstname) {
      return res.status(400).json({ message: 'First Name is required' });
    }
    if (!cleanedData.mobileNumber) {
      return res.status(400).json({ message: 'Mobile Number is required' });
    }
    if (!cleanedData.designation) {
      return res.status(400).json({ message: 'Designation is required' });
    }


    // Check for existing staff with the same mobile number
    
    const existingStaffMobileNumber = await Staff.findOne({ mobileNumber, _id: { $ne: id } });
    if (existingStaffMobileNumber) {
      return res.status(400).json({ message: 'Staff member with this mobile number already exists.' });
    }

    // Check for existing staff with the same username
    if(existingStaff.username){
    const existingStaffUsername = await Staff.findOne({ username, _id: { $ne: id } });
    if (existingStaffUsername) {
      return res.status(400).json({ message: 'Staff member with this username already exists.' });
    }}

    // If the designation is "Sales", handle username and password logic
    if (designation === 'Sales') {
      // Ensure username and password are provided
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for Sales staff.' });
      }

      if (cleanedData.password && existingStaff.password) {
        const oldPassword = decrypt(existingStaff.password);
        const isMatch = password === oldPassword;
        if (!isMatch) {
          cleanedData.password = encrypt(cleanedData.password);
        }
      }else{
        cleanedData.password = encrypt(cleanedData.password);
      }
    } else if (existingStaff.designation === 'Sales' && (designation === 'Driver' || designation === 'Helper')) {
      // If changing from Sales to Driver or Helper, remove username and password
      await Staff.findByIdAndUpdate(id, { $unset: { username: "", password: "" } });
    }

    Object.assign(existingStaff, cleanedData);
    const updatedStaff = await existingStaff.save();

    // Proceed with updating the staff record
    // const updatedStaff = await Staff.findByIdAndUpdate(id, cleanedData, { new: true });
    
    // If staff not found
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ 
      message: "Staff edited successfully.",
      data: updatedStaff,
    });    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};





// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    // Check if the staff (salesman, driver, or helper) has an active ride
    const activeRide = await ride.findOne({
      $or: [
        { salesmanId: req.params.id },
        { driverId: req.params.id },
        { helperId: req.params.id }
      ],
      status: 'active'
    });

    if (activeRide) {
      return res.status(400).json({ message: 'Cannot delete staff. Staff member has an active ride.' });
    }

    // Proceed to delete the staff
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);

    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Login for Sales staff
// Import necessary modules
// const Ride = require('../models/Ride'); // Ensure this is the correct path for your Ride model

// Login for Sales staff
exports.loginSalesStaff = async (req, res) => {
  try {    
    const { username, password } = req.body;

    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find the staff member with the provided username (case-sensitive match)
    const staff = await Staff.findOne({ username, designation: 'Sales' });

    // If staff not found
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found.' });
    }    

    const oldPassword = decrypt(staff.password);
    const isMatch = password === oldPassword;

    // Match the password
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Password!' });
    }

    // Check if the salesman has an ongoing ride
    const activeRide = await ride.findOne({ salesmanId: staff._id, status: 'active' });

    const token = jwt.sign(
      {
        id: staff._id,
        userName: staff.username,
      },
      process.env.JWT_SECRET, 
      { expiresIn: '12h' }
    );

    // Destructure and exclude sensitive fields
    const { password: _, ...staffData } = staff._doc;

    // Log successful login
    console.log(`${staff.username} logged in successfully`);

    // Send response without the password field
    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      data: staffData,
      hasActiveRide: !!activeRide, 
      activeRideId: activeRide ? activeRide._id : null,
      salesmanId: staff._id,
    });

  } catch (error) {
    console.error('Error during login:', error);    
    res.status(500).json({ message: "Internal server error." });
  }
};




function cleanCustomerData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key]);
    return acc;
  }, {});
}

























//Encrpytion 
function encrypt(text) {
  try {
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag().toString('hex'); // Get authentication tag

      return `${iv.toString('hex')}:${encrypted}:${authTag}`; // Return IV, encrypted text, and tag
  } catch (error) {
      console.error("Encryption error:", error);
      throw error;
  }
}


//Decrpytion
function decrypt(encryptedText) {
  try {
      // Split the encrypted text to get the IV, encrypted data, and authentication tag
      const [ivHex, encryptedData, authTagHex] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      // Create the decipher with the algorithm, key, and IV
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag); // Set the authentication tag

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
  } catch (error) {
      console.error("Decryption error:", error);
      throw error;
  }
}