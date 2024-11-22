const ActiveRoute = require('../../Models/ActiveRoute');
const EndRide = require('../../Models/EndRide');

exports.endRide = async (req, res) => {
  try {
    console.log("End Ride Data:", req.body);

    const cleanedData = cleanCustomerData(req.body);

    const { activeRouteId } = cleanedData;

    if (!activeRouteId) {
      return res.status(400).json({ message: "Active Route ID is required." });
    }



    // Create a new EndRide entry
    const endRideEntry = new EndRide({ ...cleanedData });

    // const endRideEntry = new EndRide({
    //   endingKM,
    //   travelledKM,
    //   expenses,
    //   activeRouteId,
    //   salesMan,
    //   driver,
    //   vehicleNo,
    //   mainRoute,
    //   stock,
    //   subRoute,
    // });

    // Save the new EndRide entry and log success
    await endRideEntry.save();
    console.log("End ride entry created successfully:", endRideEntry);

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




exports.getEndRide = async (req, res) => {
  try {
    const { endRideId } = req.params;

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




  //Clean Data 
  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }