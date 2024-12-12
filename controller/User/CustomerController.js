// const BusinessCustomer = require('../Models/BussinessCustomerSchema');
const Customer = require('../../Models/CustomerSchema');
const Account = require('../../Models/account');
const TrialBalance = require('../../Models/trialBalance');
const moment = require('moment-timezone')

 
//Add Customer
exports.createCustomer = async (req, res) => {
  console.log("Add Customer:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    
    const { fullName, whatsappNumber, location, email } = cleanedData;

    console.log('cleaned data:',cleanedData);
    
    
    
    // Validate required fields
    if (!cleanedData.fullName) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!cleanedData.customerType) {
      return res.status(400).json({ message: 'Select Customer Type.' });
    }
    

    if(cleanedData.whatsappNumber){
    const existingWhatsappNumber = await Customer.findOne({ whatsappNumber });
    if (existingWhatsappNumber) {
      return res.status(400).json({ message: 'A customer with this WhatsApp number already exists.' });
      }
    }

    if(cleanedData.email){
      const existingEmail = await Customer.findOne({ email : cleanedData.email });
      if (existingEmail) {      
        return res.status(400).json({ message: 'A customer with this email already exists.' });
      }
    }
    // Generate customerID
    let nextIdNumber = 1; // Default if the collection is empty
    const lastCustomer = await Customer.findOne().sort({ createdAt: -1 }); // Sort by creation date to find the last one
    if (lastCustomer) {
      const lastId = parseInt(lastCustomer.customerID.slice(2)); // Extract the numeric part from the customerID
      nextIdNumber = lastId + 1; // Increment the last numeric part
    }

    cleanedData.customerID = `LW${nextIdNumber.toString().padStart(4, '0')}`;

    // Handle location: check if it's provided and valid, otherwise set a default location
    let transformedLocation = null;
    if (location && location.coordinates && location.coordinates.latitude && location.coordinates.longitude) {
      // Valid location data
      transformedLocation = {
        address: location.address || '', // Default to empty string if address is not provided
        coordinates: {
          type: "Point",
          coordinates: [location.coordinates.longitude, location.coordinates.latitude]
        }
      };
    } else {
      // Set default location with valid numeric coordinates [0, 0]
      transformedLocation = {
        address: '', // Default address if none provided
        coordinates: { type: "Point", coordinates: [0, 0] } // Use [0, 0] instead of null values
      };
    }

    const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
    const openingDate = generatedDateTime.dateTime; 

    // Create a new customer with the transformed location
    const newCustomer = new Customer({ ...cleanedData, location: transformedLocation });

    const savedCustomer = await newCustomer.save();

    // Create a new account
    const newAccount = new Account({
      accountName: savedCustomer.fullName,
      accountId: savedCustomer._id,
      openingDate:openingDate,
      accountSubhead: "Sundry Debtors",
      accountHead: "Asset",
      accountGroup: "Asset",
      description: "Customer",
    });

    const savedAccount = await newAccount.save();

    // Create trial balance entry
    const trialEntry = new TrialBalance({
      operationId: savedCustomer._id,
      date: savedCustomer.createdAt,
      date: savedCustomer.openingDate,
      accountId: savedAccount._id,
      accountName: savedAccount.accountName,
      action: "Opening Balance",
      debitAmount: savedCustomer.depositAmount || 0,
      creditAmount: 0,
    });
    await trialEntry.save();

    console.log(data);
    
    return res.status(201).json({
      message: 'Customer created successfully!',
      data: savedCustomer
    });
    
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: "Internal server error." });
  }
};



// Ensure correct path to your model

// Controller to add a customer from Salesman module
// const addCustomerFromSalesman = async (req, res) => {
//   try {
//     const {
//       customerType,
//       companyName,
//       firstName,
//       lastName,
//       email,
//       numberOfBottles,
//       rate,
//       paymentMode,
//       contactNumber,
//       whatsappNumber,
//       depositAmount,
//       mainRoute,
//       subRoute,
//       location
//     } = req.body;

//     // Transform location only if it's provided and contains valid coordinates
//     let transformedLocation;
//     if (location && location.coordinates && location.coordinates.latitude && location.coordinates.longitude) {
//       transformedLocation = {
//         address: location.address || '', // Default to empty string if address is not provided
//         coordinates: {
//           type: "Point",
//           coordinates: [location.coordinates.longitude, location.coordinates.latitude]
//         }
//       };
//     }

//     // Create a new customer document
//     const newCustomer = new Customer({
//       customerType,
//       companyName,
//       firstName,
//       lastName,
//       email,
//       noOfBottles: numberOfBottles,
//       ratePerBottle: rate,
//       paymentMode,
//       mobileNo: contactNumber,
//       whatsappNo: whatsappNumber,
//       depositAmount,
//       mainRoute,
//       subRoute,
//       location: transformedLocation // This will be undefined if location is not provided
//     });

//     const savedCustomer = await newCustomer.save();
//     res.status(201).json({ message: 'Customer added successfully', customer: savedCustomer, status: 201 });
//   } catch (error) {
//     console.error('Error adding customer:', error);
//     res.status(500).json({ message: 'Error adding customer', error: error.message });
//   }
// };





 
// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business customers', error });
  }
};
 
// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business customer', error });
  }
};
 

// Update a customer by ID
exports.updateCustomerById = async (req, res) => {
  try {
    console.log("Update Customer:", req.body);
    const { id } = req.params;

    // Check and handle location
    if (req.body.location) {
      // Check if location is an object and not a stringified object like '[object Object]'
      if (typeof req.body.location === "object" && req.body.location !== null) {
        const { address = '', latitude, longitude } = req.body.location;

        // Validate and parse latitude and longitude
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);

        // Check if latitude and longitude are valid numbers
        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
          console.error("Invalid latitude or longitude");
          return res.status(400).json({ message: "Invalid latitude or longitude" });
        }

        // Update the location field
        req.body.location = {
          address,
          coordinates: {
            type: "Point",
            coordinates: [parsedLongitude, parsedLatitude], // [longitude, latitude]
          },
        };
      } else {
        // If location is not a valid object, ignore it and log the issue
        console.warn("Invalid location object received, skipping location update");
        delete req.body.location; // Ensure location is not updated in this case
      }
    }
    const existingCustonmer = await Customer.findById(id);
    if (!existingCustonmer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Clean the customer data (ensure you have a cleanCustomerData function if needed)
    const cleanedData = cleanCustomerData(req.body);
    console.log("Cleaned Data:", cleanedData);

    if (cleanedData.depositAmount === "NaN") {
      cleanedData.depositAmount = null; // or 0, depending on your requirements
    }

    const { fullName, whatsappNumber, location, email } = cleanedData;

    // cleanedData.logo=cleanedData.logo[1]
    cleanedData.location=req.body.location

    // Validate required fields
    if (!cleanedData.fullName) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!cleanedData.customerType) {
      return res.status(400).json({ message: 'Select Customer Type.' });
    }
    

    // Check for existing customer by WhatsApp number (unique identifier)
    if(cleanedData.whatsappNumber){
      const existingWhatsappNumber = await Customer.findOne({ whatsappNumber, _id: { $ne: id } });
      if (existingWhatsappNumber) {
        return res.status(400).json({ message: 'A customer with this WhatsApp number already exists.' });
      }
    }

    if(cleanedData.email){
      const existingEmail = await Customer.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'A customer with this email already exists.' });
      }
    }

    


    // Update the customer in the database
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      cleanedData,
      { new: true } 
    );

    // Check if the customer was found and updated
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update customerDisplayName in associated Account documents
    if ( cleanedData.fullName !== existingCustonmer.fullName) {
      const updatedAccount = await Account.updateMany(
        {
          accountName: existingCustonmer.fullName,
        },
        { $set: { accountName: cleanedData.fullName } }
      );
      console.log(
        `${updatedAccount.modifiedCount} account(s) associated with the accountName have been updated with the new customerDisplayName.`
      );
    }


    res.status(200).json({ 
      message: 'Customer Edited successfully',
      data: updatedCustomer,
    });    
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Delete a business customer by ID
exports.deleteCustomerById = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting  customer', error });
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




    // Function to generate time and date for storing in the database
function generateTimeAndDateForDB(
  timeZone,
  dateFormat,
  dateSplit,
  baseTime = new Date(),
  timeFormat = "HH:mm:ss",
  timeSplit = ":"
) {
  // Convert the base time to the desired time zone
  const localDate = moment.tz(baseTime, timeZone);

  // Format date and time according to the specified formats
  let formattedDate = localDate.format(dateFormat);

  // Handle date split if specified
  if (dateSplit) {
    // Replace default split characters with specified split characters
    formattedDate = formattedDate.replace(/[-/]/g, dateSplit); // Adjust regex based on your date format separators
  }

  const formattedTime = localDate.format(timeFormat);
  const timeZoneName = localDate.format("z"); // Get time zone abbreviation

  // Combine the formatted date and time with the split characters and time zone
  const dateTime = `${formattedDate} ${formattedTime
    .split(":")
    .join(timeSplit)}`;

  return {
    date: formattedDate,
    time: `${formattedTime} (${timeZoneName})`,
    dateTime: dateTime,
  };
}