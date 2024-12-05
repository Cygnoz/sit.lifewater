const Vehicle = require('../../Models/VehicleSchema'); 


// Add a new vehicle
exports.addVehicle = async (req, res) => {
  try {
    console.log("Add Vechile:", req.body);
    const cleanedData = cleanCustomerData(req.body);

     // Validate required fields
    if (!cleanedData.vehicleNo) {
     return res.status(400).json({ message: 'Vehicle Number required' });
    }
    if (!cleanedData.startingKilometer) {
      return res.status(400).json({ message: 'Starting Kilometer required' });
     }

    // Check if vehicle already exists by vehicle number
    const existingVehicle = await Vehicle.findOne({ vehicleNo: cleanedData.vehicleNo });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    // Create a new vehicle instance
    const vehicle = new Vehicle({ ...cleanedData });

    // Save vehicle to the database
    const savedVehicle = await vehicle.save();
    res.status(200).json({ 
      message: 'Vechile added successfully',
      data: savedVehicle,
    });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    res.status(500).json({ message: "Internal server error." });
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

    // cleanedData.image=cleanedData.image[0];
    
     // Validate required fields
    if (!cleanedData.vehicleNo) {
      return res.status(400).json({ message: 'Vehicle Number required' });
    }
    if (!cleanedData.startingKilometer) {
     return res.status(400).json({ message: 'Starting Kilometer required' });
    }

    const existingVehicle = await Vehicle.findOne({ vehicleNo: cleanedData.vehicleNo, _id: { $ne: id }  });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    // Update vehicle by Object ID
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, cleanedData, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ 
      message: 'Main Route Edited successfully',
      data: updatedVehicle,
    });

  } catch (error) {
    console.error('Error updating vehicle:', error.message);
    res.status(500).json({ message: "Internal server error." });
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
    res.status(500).json({ message: "Internal server error." });
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
    res.status(500).json({ message: "Internal server error." });
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