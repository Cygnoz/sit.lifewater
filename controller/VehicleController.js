const Vehicle = require('../Models/VehicleSchema'); // Assuming Vehicle schema is in the Model folder

// Add a new vehicle
const addVehicle = async (req, res) => {
  try {
    const { vehicleNo, insuranceValidity, insuranceStatus, registrationValidity, insuranceAmount, licenseAmount, licenseValidity, startingKilometer, expenses } = req.body;

    // Handle the uploaded image
    const vehicleImage = req.file ? req.file.filename : null;

    // Check if vehicle already exists by vehicle number
    const existingVehicle = await Vehicle.findOne({ vehicleNo });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    // Create a new vehicle instance
    const vehicle = new Vehicle({
      vehicleNo,
      image: vehicleImage,
      insuranceValidity,
      insuranceStatus,
      registrationValidity,
      insuranceAmount,
      licenseAmount,
      licenseValidity,
      startingKilometer,
      expenses
    });

    // Save vehicle to the database
    const savedVehicle = await vehicle.save();
    return res.status(201).json({status:201, data: savedVehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    return res.status(500).json({ message: 'Error adding vehicle', error: error.message });
  }
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find(); // Fetch all vehicles
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    return res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};


const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body }; // Spread the request body

    // Handle image update if provided
    if (req.file) {
      updateData.image = req.file.filename; // Store the image filename
    }

    // Update vehicle by Object ID
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error.message);
    return res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
};



// Delete vehicle by Object ID
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params; // Using the vehicle's Object ID

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error.message);
    return res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
};

// View a particular vehicle by Object ID
const viewVehicleById = async (req, res) => {
  try {
    const { id } = req.params; // Using the vehicle's Object ID

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({ vehicle });
  } catch (error) {
    console.error('Error fetching vehicle:', error.message);
    return res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  viewVehicleById
};
