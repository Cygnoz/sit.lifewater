const MainRoute = require("../Models/RouteSchema");
const mongoose = require('mongoose');
const SubRoute = require('../Models/SubrouteSchema');
 
 
// Add a new route
exports.addRoute = async (req, res) => {
  try {
    // Log the body to check if data is being received correctly
    console.log("Add Route:",req.body);
    const cleanedData = cleanCustomerData(req.body);


    // Validate required fields
    if (!cleanedData.routeCode || !cleanedData.mainRoute) {
      return res.status(400).json({ message: 'Missing required fields: Route Code or Main Route' });
    }

    // Check if a route with the same routeCode already exists
    const existingRoute = await MainRoute.findOne({ routeCode: cleanedData.routeCode });

    if (existingRoute) {
      return res.status(400).json({ message: 'Route with this code already exists.' });
    }

    // Create a new route
    const newRoute = new MainRoute({ ...cleanedData });

    // const newRoute = new MainRoute({
    //   mainRoute: req.body.mainRoute,
    //   routeCode: req.body.routeCode,
    //   description: req.body.description,
    // });

    // Save the new route in the database
    const savedRoute = await newRoute.save();

    // Send success response
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error creating route:', error.message);
    res.status(500).json({ message: 'Error creating route', error: error.message });
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
    return res.status(500).json({ message: 'Error deleting route', error: error.message });
  }
};
 
 
// Update a route by ObjectId
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanedData = cleanCustomerData(req.body);

    // const updateData = req.body;

    const updatedRoute = await MainRoute.findByIdAndUpdate(id, cleanedData, { new: true });
    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
 
    return res.status(200).json({  route: updatedRoute });
  } catch (error) {
    console.error('Error updating route:', error.message);
    return res.status(500).json({  error: error.message });
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