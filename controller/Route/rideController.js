const Ride = require('../../Models/ride');
const MainRoute = require('../../Models/MainRouteSchema');
const SubRoute = require('../../Models/SubrouteSchema');
const Staff = require('../../Models/StaffSchema');

// Utility function to fetch existing ride data for personnel
const fetchActiveRideData = async (helperId, driverId, salesmanId, vehicleNumber) => {
    const query = [];

    if (helperId) {
        query.push({ helperId, status: 'active' });
    }

    if (driverId) {
        query.push({ driverId, status: 'active' });
    }

    if (salesmanId) {
        query.push({ salesmanId, status: 'active' });
    }

    if (vehicleNumber) {
        query.push({ vehicleNumber, status: 'active' });
    }

    if (query.length === 0) return [];

    // Fetch all active rides for the given IDs or vehicle number
    return Ride.find({ $or: query }, { helperId: 1, driverId: 1, salesmanId: 1, vehicleNumber: 1 });
};

// Function to validate if personnel or vehicle are already assigned to an active ride
const validateRideAssignments = async (helperId, driverId, salesmanId, vehicleNumber) => {
    const activeRides = await fetchActiveRideData(helperId, driverId, salesmanId, vehicleNumber);

    if (activeRides.length > 0) {
        for (const ride of activeRides) {
            if (ride.helperId === helperId) {
                throw new Error('This helper is already assigned to an active ride.');
            }

            if (ride.driverId === driverId) {
                throw new Error('This driver is already assigned to an active ride.');
            }

            if (ride.salesmanId === salesmanId) {
                throw new Error('This salesman is already assigned to an active ride.');
            }

            if (ride.vehicleNumber === vehicleNumber) {
                throw new Error('This vehicle is already assigned to an active ride.');
            }
        }
    }
};

// Function to fetch stock from a subroute
const fetchSubrouteStock = async (subRouteId) => {
    const subroute = await SubRoute.findOne({ _id: subRouteId });
    if (!subroute || !subroute.stock || subroute.stock.length === 0) {
        throw new Error('No stock available in the selected subroute.');
    }
    return subroute.stock;
};

// Update the startRide function to check for stock availability
exports.startRide = async (req, res) => {
    console.log("Add Ride:", req.body);
    try {
        const cleanedData = cleanCustomerData(req.body);

        console.log('Cleaned data:', cleanedData);

        // Validate required fields
        if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
            return res.status(400).json({ message: 'Select main Route' });
        }
        if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
            return res.status(400).json({ message: 'Select Customer Type.' });
        }

        // Validate ride assignments
        try {
            await validateRideAssignments(
                cleanedData.helperId,
                cleanedData.driverId,
                cleanedData.salesmanId,
                cleanedData.vehicleNumber
            );
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Check for stock in the subroute
        let subrouteStock;
        try {
            subrouteStock = await fetchSubrouteStock(cleanedData.subRouteId);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Add stock to the ride
        const newRide = new Ride({
            ...cleanedData,
            stock: subrouteStock,
        });
        const savedRide = await newRide.save();

        return res.status(201).json({
            message: 'Ride Started successfully!',
            data: savedRide,
        });

    } catch (error) {
        console.error('Error starting ride:', error);
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