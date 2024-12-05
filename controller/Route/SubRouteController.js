const Subroute = require('../../Models/SubrouteSchema'); 
const MainRoute = require('../../Models/MainRouteSchema'); 

// Add a new subroute
exports.addSubroute = async (req, res) => {
    try {
      console.log("Add Sub Route:", req.body);
      const cleanedData = cleanCustomerData(req.body);

      
      if (!cleanedData.subRouteName) {
        return res.status(400).json({ message: 'Sub Route Name is required' });
      }
      if (!cleanedData.subrouteCode) {
        return res.status(400).json({ message: 'Sub Route Code is required' });
      }
      if (!cleanedData.mainRouteId) {
        return res.status(400).json({ message: 'Select a Main Route' });
      }
  
      // Check if a subroute with the same subrouteCode already exists
      const existingSubrouteCode = await Subroute.findOne({ subrouteCode: cleanedData.subrouteCode });
      if (existingSubrouteCode) {
        return res.status(400).json({ message: 'Sub Route with this code already exists.' });
      }
      const existingSubrouteName = await Subroute.findOne({ subRouteName: cleanedData.subRouteName });
      if (existingSubrouteName) {
        return res.status(400).json({ message: 'Sub Route with this name already exists.' });
      }
  
      // Create a new subroute
      const newSubroute = new Subroute({ ...cleanedData });
      const savedSubroute = await newSubroute.save();
  
      // Send success response
      res.status(200).json({ 
        message: 'Sub Route added successfully',
        data: savedSubroute,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
};  

// Edit an existing subroute by ID
exports.editSubroute = async (req, res) => {
  try {
    console.log("Edit Sub Route:", req.body);
    const { id } = req.params;
    const cleanedData = cleanCustomerData(req.body);


    if (!cleanedData.subRouteName) {
      return res.status(400).json({ message: 'Sub Route Name is required' });
    }
    if (!cleanedData.subrouteCode) {
      return res.status(400).json({ message: 'Sub Route Code is required' });
    }
    if (!cleanedData.mainRouteId) {
      return res.status(400).json({ message: 'Select a Main Route' });
    }

    // Check if a subroute with the same subrouteCode already exists
    const existingSubrouteCode = await Subroute.findOne({ subrouteCode: cleanedData.subrouteCode , _id: { $ne: id } });
    if (existingSubrouteCode) {
      return res.status(400).json({ message: 'Sub Route with this code already exists.' });
    }
    const existingSubrouteName = await Subroute.findOne({ subRouteName: cleanedData.subRouteName, _id: { $ne: id } });
    if (existingSubrouteName) {
      return res.status(400).json({ message: 'Sub Route with this name already exists.' });
    }


    // Update the subRoute document, including the mainRoute reference
    const updatedSubroute = await Subroute.findByIdAndUpdate( id, cleanedData, { new: true} );

    if (!updatedSubroute) {
      return res.status(404).json({ message: 'Subroute not found' });
    }

    res.status(200).json({ 
      message: 'Sub Route Edited successfully',
      data: updatedSubroute,
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error." });
  }
}

// Delete a subroute by ID
exports.deleteSubroute = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubroute = await Subroute.findByIdAndDelete(id);

        if (!deletedSubroute) {
            return res.status(404).json({ message: 'Subroute not found' });
        }

        res.status(200).json({ message: 'Subroute deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};


// View a single subroute by ID
exports.viewSubroute = async (req, res) => {
    try {
        const { id } = req.params;

        const subroute = await Subroute.findById(id);

        if (!subroute) {
            return res.status(404).json({ message: 'Subroute not found' });
        }

        res.status(200).json(subroute);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subroute', error });
    }
};


// View all subroutes
exports.viewAllSubroutes = async (req, res) => {
  try {
      const subRoutes = await Subroute.find();
      const mainRoutes = await MainRoute.find();

      if (subRoutes.length === 0) {
          return res.status(404).json({ message: 'No subroutes found' });
      }

      const enrichedSubRoutes = subRoutes.map(subRoute => {
        const mainRoute = mainRoutes.find(route => String(route._id) === String(subRoute.mainRouteId));
        return {
          ...subRoute.toObject(), // Convert Mongoose Document to plain object
          mainRouteName: mainRoute ? mainRoute.mainRouteName : undefined, 
        };
      });

      res.status(200).json(enrichedSubRoutes);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching subroutes', error });
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