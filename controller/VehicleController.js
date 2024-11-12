const Vehicle = require('../Models/VehicleSchema'); // Assuming Vehicle schema is in the Model folder

// Add a new vehicle
exports.addVehicle = async (req, res) => {
  try {
    console.log("Add Vechile:", req.body);
    const cleanedData = cleanCustomerData(req.body);

    // Handle the uploaded image
    // const vehicleImage = req.file ? req.file.filename : null;

    // Check if vehicle already exists by vehicle number
    const existingVehicle = await Vehicle.findOne({ vehicleNo: cleanedData.vehicleNo });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    // Create a new vehicle instance
    const vehicle = new Vehicle({ ...cleanedData });

    // const vehicle = new Vehicle({
    //   vehicleNo,
    //   image: vehicleImage,
    //   insuranceValidity,
    //   insuranceStatus,
    //   registrationValidity,
    //   insuranceAmount,
    //   licenseAmount,
    //   licenseValidity,
    //   startingKilometer,
    //   expenses
    // });

    // Save vehicle to the database
    const savedVehicle = await vehicle.save();
    return res.status(201).json({status:201, data: savedVehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    return res.status(500).json({ message: 'Error adding vehicle', error: error.message });
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find(); // Fetch all vehicles
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    return res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};


exports.updateVehicle = async (req, res) => {
  try {
    console.log("Edit Customer:", req.body);
    const { id } = req.params;
    const cleanedData = cleanCustomerData(req.body);

    // const updateData = { ...req.body }; // Spread the request body

    // Handle image update if provided
    // if (req.file) {
    //   updateData.image = req.file.filename; // Store the image filename
    // }

    // Update vehicle by Object ID
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, cleanedData, { new: true });

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
exports.deleteVehicle = async (req, res) => {
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
exports.viewVehicleById = async (req, res) => {
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






  //Clean Data 
  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }