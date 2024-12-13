const Ride = require('../../Models/ride');
const MainRoute = require('../../Models/MainRouteSchema');
const SubRoute = require('../../Models/SubrouteSchema');
const Staff = require('../../Models/StaffSchema');


//Add Customer
exports.startRide = async (req, res) => {
    console.log("Add Ride:", req.body);
    try {
      const cleanedData = cleanCustomerData(req.body);
        
      console.log('Cleaned data:',cleanedData);     
      
      
      // Validate required fields
      if (!cleanedData.mainRouteId || !cleanedData.mainRouteName ) {
        return res.status(400).json({ message: 'Select main Route' });
      }
      if (!cleanedData.subRouteId || !cleanedData.subRouteName ) {
        return res.status(400).json({ message: 'Select Customer Type.' });
      }
      
  
      if (cleanedData.helperId) {
        try {
          const helper = await Staff.findOne({
            _id: cleanedData.helperId,
            designation: 'helper',
          });
          if (helper) {
            return res.status(400).json({ message: 'A helper with this ID already exists.' });
          }
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error.', error });
        }
      }



  
      if (cleanedData.driverId) {
        try {
          const driver = await Staff.findOne({
            _id: cleanedData.driverId,
            designation: 'driver',
          });
          if (driver) {
            return res.status(400).json({ message: 'A driver with this ID already exists.' });
          }
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error.', error });
        }
      }



      if (cleanedData.salesmanId) {
        try {
          const sale = await Staff.findOne({
            _id: cleanedData.salesmanId,
            designation: 'sale',
          });
          if (sale) {
            return res.status(400).json({ message: 'A sale with this ID already exists.' });
          }
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error.', error });
        }
      }
     
  
      // Create a new customer with the transformed location
      const newRide = new Ride({ ...cleanedData});  
      const savedRide = await newRide.save();
     
      
      return res.status(201).json({
        message: 'Ride Stareted successfully!',
        data: savedRide
      });
      
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: "Internal server error." });
    }
  };