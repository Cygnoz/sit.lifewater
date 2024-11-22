const ActiveRoute = require('../../Models/ActiveRoute'); // Adjust the path accordingly

//Create a new Active Route
exports.createActiveRoute = async (req, res) => {
  try {
    console.log("Create Active Route:", req.body);
    const cleanedData = cleanCustomerData(req.body);
    // const { mainRoute, subRoute, helper, driver, vehicleNo, openingStock, loadedStock, totalStock, startingKm ,Salesman } = req.body;

    // Create a new ActiveRoute instance
    const newActiveRoute = new ActiveRoute({ ...cleanedData,  });

    // const newActiveRoute = new ActiveRoute({
    //   mainRoute,
    //   subRoute,
    //   helper,
    //   driver,
    //   vehicleNo,
    //   openingStock,
    //   loadedStock,
    //   totalStock,
    //   startingKm,
    //   Salesman
    // });

    // Save the new ActiveRoute to the database
    await newActiveRoute.save();

    // Send a success response
    res.status(201).json({
      message: 'Active Route created successfully',
      data: newActiveRoute,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating the ActiveRoute',
      error: error.message,
    });
  }
};


exports.getActiveRoutes = async (req, res) => {
  try {
    // Retrieve all active routes from the database
    const activeRoutes = await ActiveRoute.find();

    // Send a success response with the active routes data
    res.status(200).json({
      message: 'ActiveRoutes retrieved successfully',
      data: activeRoutes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while retrieving ActiveRoutes',
      error: error.message,
    });
  }
};

exports.deleteActiveRoute = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the ActiveRoute with the specified ID
    const deletedActiveRoute = await ActiveRoute.findByIdAndDelete(id);

    // Check if the ActiveRoute was found and deleted
    if (!deletedActiveRoute) {
      return res.status(404).json({
        message: 'ActiveRoute not found',
      });
    }

    // Send a success response if deletion was successful
    res.status(200).json({
      message: 'ActiveRoute deleted successfully',
      data: deletedActiveRoute,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while deleting the ActiveRoute',
      error: error.message,
    });
  }
};

// View a particular vehicle by Object ID
exports.viewActiveRouteById = async (req, res) => {
  try {
    const { id } = req.params; // Using the vehicle's Object ID

    const route = await ActiveRoute.findById(id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    return res.status(200).json({ route });
    
  } catch (error) {
    console.error('Error fetching route:', error.message);
    return res.status(500).json({ message: 'Error fetching route', error: error.message });
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