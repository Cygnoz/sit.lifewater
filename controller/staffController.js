


// Add new staff
const bcrypt = require('bcrypt');
const Staff = require("../Models/StaffSchema"); // Ensure the path matches the casing


// Get all staff members
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit (Update) staff
// Utility function to normalize file paths
const normalizeFilePath = (filePath) => {
  return filePath.replace(/\\/g, "/").replace(/^uploads\//, ""); // remove "uploads/" prefix if it exists
};

const addStaff = async (req, res) => {
  try {
    const { firstname, lastname, username, designation, password, emiratesId, mobileNumber } = req.body;

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

      // Hash the password
      const hashedPassword = await bcrypt.hash(password.trim(),10);
      
      // Create the new staff record for "Sales"
      const newStaff = new Staff({
        firstname,
        lastname,
        username: username.trim(),
        password: hashedPassword,
        profile: req.file ? normalizeFilePath(req.file.path) : null,
        address: req.body.address,
        visaStatus: req.body.visaStatus,
        visaValidity: req.body.visaValidity,
        mobileNumber,
        whatsAppNumber: req.body.whatsAppNumber,
        visaNumber: req.body.visaNumber,
        dateofBirth: req.body.dateofBirth,
        nationality: req.body.nationality,
        designation,
        emiratesId,
      });

      // Save the staff record
      const savedStaff = await newStaff.save();
      return res.status(201).json(savedStaff);
    }

    // For other designations (Driver, Helper)
    const newStaff = new Staff({
      firstname,
      lastname,
      profile: req.file ? normalizeFilePath(req.file.path) : null,
      address: req.body.address,
      visaStatus: req.body.visaStatus,
      visaValidity: req.body.visaValidity,
      mobileNumber,
      whatsAppNumber: req.body.whatsAppNumber,
      visaNumber: req.body.visaNumber,
      dateofBirth: req.body.dateofBirth,
      nationality: req.body.nationality,
      designation,
      emiratesId,
    });

    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const editStaff = async (req, res) => {
  try {
    const { designation, username, password, emiratesId } = req.body;
    const updatedData = { ...req.body };

    // Check if a new profile image is uploaded
    if (req.file) {
      updatedData.profile = normalizeFilePath(req.file.path); // Normalize path on update
    }

    // If the designation is "Sales", handle username and password logic
    if (designation === 'Sales') {
      // Ensure username and password are provided
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required for Sales staff.' });
      }

      // Trim username and password to avoid accidental spaces
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

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

    res.status(200).json(updatedStaff);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ message: 'Staff not found' });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login for Sales staff
const loginSalesStaff = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Trim the username and password to avoid accidental spaces
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Find the staff member with the provided username (case-sensitive match)
    const staff = await Staff.findOne({ username: trimmedUsername });

    // If staff not found
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found.' });
    }

    // Only allow login if the staff's designation is 'Sales'
    if (staff.designation !== 'Sales') {
      return res.status(403).json({ message: 'Unauthorized. Only Sales staff can log in here.' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(trimmedPassword, staff.password);

    // Debugging logs for verification (can be removed in production)
    console.log('Plain Password:', trimmedPassword); 
    console.log('Hashed Password:', staff.password); 
    console.log('Is Password Valid:', isPasswordValid);

    // If the password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // At this point, the login is successful
    res.status(200).json({ message: 'Login successful', staff, status: 200 });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  addStaff,
  getAllStaff,
  getStaffById,
  editStaff,
  deleteStaff,
  loginSalesStaff
};
