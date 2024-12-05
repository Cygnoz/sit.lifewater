const MainRoute = require("../../Models/MainRouteSchema");
const mongoose = require('mongoose');
const SubRoute = require('../../Models/SubrouteSchema');
 
 
// Add a new route
exports.addRoute = async (req, res) => {
  try {
    // Log the body to check if data is being received correctly
    console.log("Add Route:",req.body);
    const cleanedData = cleanCustomerData(req.body);


    // Validate required fields
    if (!cleanedData.mainRouteCode) {
      return res.status(400).json({ message: 'Route Code required' });
    }
    // Validate required fields
    if (!cleanedData.mainRouteName) {
      return res.status(400).json({ message: 'Main Route required' });
    }

    // Check if a route with the same routeCode already exists
    const existingRouteCode = await MainRoute.findOne({ mainRouteCode: cleanedData.mainRouteCode });
    if (existingRouteCode) {
      return res.status(400).json({ message: 'Route with this code already exists.' });
    }

    const existingRouteName = await MainRoute.findOne({ mainRouteName: cleanedData.mainRouteName });
    if (existingRouteName) {
      return res.status(400).json({ message: 'Route with this name already exists.' });
    }



    // Create a new route
    const newRoute = new MainRoute({ ...cleanedData });
    const savedRoute = await newRoute.save();
    console.log("Main Route added successfully",savedRoute);
    

    // Send success response
    res.status(200).json({ 
      message: 'Main Route added successfully',
      data: savedRoute,
    });
  } catch (error) {
    console.error('Error creating route:', error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

 
 
 
// Delete a route by ObjectId
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID received for deletion:", id);  // Log the ID to verify it's being passed correctly
 
    const deletedRoute = await MainRoute.findByIdAndDelete(id);
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
 
    return res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
 
 

// Update a route by ObjectId
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanedData = cleanCustomerData(req.body);

    // Check if routeCode already exists 
    const existingRouteCode = await MainRoute.findOne({ 
      mainRouteCode: cleanedData.mainRouteCode, 
      _id: { $ne: id } 
    });
    if (existingRouteCode) {
      return res.status(400).json({ message: 'Route with this code already exists.' });
    }

    // Check if mainRoute already exists 
    const existingRouteName = await MainRoute.findOne({ 
      mainRouteName: cleanedData.mainRouteName, 
      _id: { $ne: id } 
    });
    if (existingRouteName) {
      return res.status(400).json({ message: 'Route with this name already exists.' });
    }


    const updatedRoute = await MainRoute.findByIdAndUpdate(id, cleanedData, { new: true });
    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    console.log('Main Route Edited successfully',updatedRoute);

    res.status(200).json({ 
      message: 'Main Route Edited successfully',
      data: updatedRoute
    });
 
    return res.status(200).json({  route: updatedRoute });
  } catch (error) {
    console.error('Error updating route:', error.message);
    return res.status(500).json({
      message: "Internal server error."
    });
  }
};
 


// View all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await MainRoute.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



 
// View a route by ObjectId
exports.viewRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false, 
        message: 'Invalid route ID format'
      });
    }

    // Find main route
    const route = await MainRoute.findById(id);
    if (!route) {
      console.log(`No route found for ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Find associated subroutes using route name
    const subroutes = await SubRoute.find({ mainRoute: route.mainRoute });
    console.log('Subroutes:', subroutes);
    console.log('Route:', route);
    
    

    // Combine data
    const routeData = {
      mainRoute: route,
      subroutes: subroutes
    };

    return res.status(200).json({
      success: true,
      data: routeData
    });

  } catch (error) {
    console.error('Error fetching route:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching route',
      error: error.message
    });
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