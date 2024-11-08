const Subroute = require('../Models/SubrouteSchema'); // Adjust the path as necessary
const Route = require('../Models/RouteSchema'); // Adjust the path as necessary

// Add a new subroute
exports.addSubroute = async (req, res) => {
    try {
      // Validate the subrouteCode
      if (!req.body.subrouteCode) {
        return res.status(400).json({ message: 'Subroute code is required' });
      }
  
      // Check if a subroute with the same subrouteCode already exists
      const existingSubroute = await Subroute.findOne({ subrouteCode: req.body.subrouteCode });
      if (existingSubroute) {
        return res.status(400).json({ message: 'Subroute with this code already exists.' });
      }
  
      // Create a new subroute
      const newSubroute = new Subroute({
        subrouteCode: req.body.subrouteCode,  // ensure correct casing
  subRoute: req.body.subRoute,
  mainRoute: req.body.mainRoute,
  description: req.body.description,
        // Add other fields as needed
      });
  
      // Save the new subroute in the database
      const savedSubroute = await newSubroute.save();
  
      // Send success response
      res.status(201).json(savedSubroute);
    } catch (error) {
      res.status(500).json({ message: 'Error adding subroute', error: error.message });
    }
  };
  

// Edit an existing subroute by ID
exports.editSubroute = async (req, res) => {
  try {
    const { id } = req.params;
    const { subRoute, subrouteCode, description, mainRoute } = req.body; // Use mainRoute (which is now an ObjectId)

    // Update the subRoute document, including the mainRoute reference
    const updatedSubroute = await Subroute.findByIdAndUpdate(
      id,
      { subRoute, subrouteCode, description, mainRoute }, // Use mainRoute for the reference
      { new: true} // Return the updated document with validators
    );

    if (!updatedSubroute) {
      return res.status(404).json({ message: 'Subroute not found' });
    }

    res.status(200).json(updatedSubroute);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error updating subroute', error });
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
        res.status(500).json({ message: 'Error deleting subroute', error });
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
        const subroutes = await Subroute.find();

        if (subroutes.length === 0) {
            return res.status(404).json({ message: 'No subroutes found' });
        }

        res.status(200).json(subroutes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subroutes', error });
    }
};
exports.getSubroutebyID = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from request parameters

        // Find the subroute by ID
        const subroute = await Subroute.findById(id);

        // If subroute not found, return a 404 response
        if (!subroute) {
            return res.status(404).json({ message: 'Subroute not found' });
        }

        // Return the found subroute
        res.status(200).json(subroute);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error fetching subroute', error: error.message });
    }
};
