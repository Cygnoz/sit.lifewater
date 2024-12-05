const bcrypt = require('bcrypt');
const Staff = require("../../Models/StaffSchema");


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
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
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

      cleanedData.password = await bcrypt.hash(password.trim(),10);
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
    res.status(500).json({ message: "Internal server error." });
  }
};




exports.editStaff = async (req, res) => {
  try {
    console.log("Edit Staff:", req.body);
    const { id } = req.params;

    const cleanedData = cleanCustomerData(req.body);

    const { designation, username, password } = req.body;

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
    const existingStaffMobileNumber = await Staff.findOne({ mobileNumber, _id: { $ne: id } });
    if (existingStaffMobileNumber) {
      return res.status(400).json({ message: 'Staff member with this mobile number already exists.' });
    }

    // Check for existing staff with the same mobile number
    const existingStaffUsername = await Staff.findOne({ username, _id: { $ne: id } });
    if (existingStaffUsername) {
      return res.status(400).json({ message: 'Staff member with this username already exists.' });
    }

    // If the designation is "Sales", handle username and password logic
    if (designation === 'Sales') {
      // Ensure username and password are provided
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for Sales staff.' });
      }

      // Check if the username already exists for another staff (excluding the current one)
      const existingSalesStaff = await Staff.findOne({
        username: trimmedUsername,
        _id: { $ne: req.params.id } // Exclude the current staff from the check
      });

      if (existingSalesStaff) {
        return res.status(400).json({ message: 'Username already taken by another user.' });
      }

      // If the password is updated, hash the new password
      if (trimmedPassword) {
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        updatedData.password = hashedPassword;
      }

      // Ensure the updatedData includes the trimmed username
      updatedData.username = trimmedUsername;
    }

    // Proceed with updating the staff record
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    
    // If staff not found
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json({ 
      message: "Staff edited successfully.",
      data: updatedStaff,
    });    
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};




// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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

    // Match the password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Password!' });
    }

    else {
      const token = jwt.sign(
        {
          id: staff._id,
          userName: staff.username,

        },
        process.env.JWT_SECRET, 
        { expiresIn: '12h' }
      );

      // Send response with user data (excluding organizationId)
      console.log(`${staff.username} logged in successfully`);
      
      res.status(200).json({
        success: true,
        token: `Bearer ${token}`
      });
    }

  } catch (error) {
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