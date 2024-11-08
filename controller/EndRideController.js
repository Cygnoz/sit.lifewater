const ActiveRoute = require('../Models/ActiveRoute');
const EndRide = require('../Models/EndRide');

const endRide = async (req, res) => {
  const { endingKM, travelledKM, expenses, activeRouteId, salesMan, driver, vehicleNo, mainRoute, stock ,subRoute } = req.body;

  if (!activeRouteId) {
    return res.status(400).json({ message: "Active Route ID is required." });
  }

  console.log("Received end ride data:", req.body);  // Initial log of request data

  try {
    // Create a new EndRide entry
    const endRideEntry = new EndRide({
      endingKM,
      travelledKM,
      expenses,
      activeRouteId,
      salesMan,
      driver,
      vehicleNo,
      mainRoute,
      stock,
      subRoute,
    });

    // Save the new EndRide entry and log success
    await endRideEntry.save();
    console.log("EndRide entry created successfully:", endRideEntry);

    // Delete the active route
    const deletedRoute = await ActiveRoute.findByIdAndDelete(activeRouteId);
    if (!deletedRoute) {
      console.warn(`No ActiveRoute found for ID ${activeRouteId}`);
      return res.status(404).json({ message: "Active route not found." });
    }

    // Successful response
    res.status(200).json({
      message: 'Ride ended and active route deleted.',
      endRideEntry,
    });
  } catch (error) {
    console.error("Error during endRide processing:", error);  // Log detailed error
    res.status(500).json({
      message: 'Failed to end ride. Please try again later.',
      error: error.message,
    });
  }
};




const getEndRide = async (req, res) => {
  const { endRideId } = req.params;

  try {
    let endRideEntry;
    if (endRideId) {
      // Specific end ride entry
      endRideEntry = await EndRide.findById(endRideId);
      if (!endRideEntry) {
        return res.status(404).json({ message: 'End ride entry not found.' });
      }
    } else {
      // All end ride entries
      endRideEntry = await EndRide.find();
    }

    res.status(200).json({
      message: 'End ride entry/entries fetched successfully.',
      data: endRideEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch end ride entries',
      error: error.message,
    });
  }
};


module.exports = { 
  endRide,
  getEndRide,
};
