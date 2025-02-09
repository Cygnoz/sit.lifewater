const Coupon = require('../../Models/CouponSchema');
const Customer = require('../../Models/CustomerSchema');
const Accounts = require('../../Models/account');
const Account = require('../../Models/account');
const couponCustomer = require('../../Models/couponCustomerSchema');
const TrialBalance = require('../../Models/trialBalance');
const Order = require('../../Models/OrderSchema')
const moment = require('moment-timezone')



const dataExist = async ( customerId , depositAccountId ) => {
  const [ customerAccount, saleAccount, depositAccount ] = await Promise.all([
    Account.findOne({  accountId:customerId }),
    Account.findOne({  accountName:"Sales" }),
    Account.findOne({  _id:depositAccountId }),
  ]);
  return { customerAccount, saleAccount, depositAccount};
};

 
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
    

    // if(cleanedData.whatsappNumber){
    // const existingWhatsappNumber = await Customer.findOne({ whatsappNumber });
    // if (existingWhatsappNumber) {
    //   return res.status(400).json({ message: 'A customer with this WhatsApp number already exists.' });
    //   }
    // }

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

    // Create a new customer with the transformed location
    const newCustomer = new Customer({ ...cleanedData, location: transformedLocation });

    const savedCustomer = await newCustomer.save();

    // Create a new account
    const newAccount = new Account({
      accountName: savedCustomer.fullName,
      accountId: savedCustomer._id,
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
      accountId: savedAccount._id,
      accountName: savedAccount.accountName,
      action: "Opening Balance",
      debitAmount: savedCustomer.depositAmount || 0,
      creditAmount: 0,
    });
    await trialEntry.save();
    
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

exports.getCustomersBySubroute = async (req, res) => {
  try {
    const subRoute = req.params.subroute;
    const customers = await Customer.find({ subRoute });

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found for this subroute' });
    }
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers by subroute', error });
  }
};
 

// Update a customer by ID
// exports.updateCustomerById = async (req, res) => {
//   try {
//     console.log("Update Customer:", req.body);
//     const { id } = req.params;

//     // Check and handle location
//     if (req.body.location) {
//       // Check if location is an object and not a stringified object like '[object Object]'
//       if (typeof req.body.location === "object" && req.body.location !== null) {
//         const { address = '', latitude, longitude } = req.body.location;

//         // Validate and parse latitude and longitude
//         const parsedLatitude = parseFloat(latitude);
//         const parsedLongitude = parseFloat(longitude);

//         // Check if latitude and longitude are valid numbers
//         if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
//           console.error("Invalid latitude or longitude");
//           return res.status(400).json({ message: "Invalid latitude or longitude" });
//         }

//         // Update the location field
//         req.body.location = {
//           address,
//           coordinates: {
//             type: "Point",
//             coordinates: [parsedLongitude, parsedLatitude], // [longitude, latitude]
//           },
//         };
//       } else {
//         // If location is not a valid object, ignore it and log the issue
//         console.warn("Invalid location object received, skipping location update");
//         delete req.body.location; // Ensure location is not updated in this case
//       }
//     }
//     const existingCustonmer = await Customer.findById(id);
//     if (!existingCustonmer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     // Clean the customer data (ensure you have a cleanCustomerData function if needed)
//     const cleanedData = cleanCustomerData(req.body);
//     console.log("Cleaned Data:", cleanedData);

//     if (cleanedData.depositAmount === "NaN") {
//       cleanedData.depositAmount = 0; // or 0, depending on your requirements
//     }

//     const { fullName, whatsappNumber, location, email } = cleanedData;

//     // cleanedData.logo=cleanedData.logo[1]
//     cleanedData.location=req.body.location

//     // Validate required fields
//     if (!cleanedData.fullName) {
//       return res.status(400).json({ message: 'Name is required.' });
//     }
//     if (!cleanedData.customerType) {
//       return res.status(400).json({ message: 'Select Customer Type.' });
//     }
    

//     // Check for existing customer by WhatsApp number (unique identifier)
//     if(cleanedData.whatsappNumber){
//       const existingWhatsappNumber = await Customer.findOne({ whatsappNumber, _id: { $ne: id } });
//       if (existingWhatsappNumber) {
//         return res.status(400).json({ message: 'A customer with this WhatsApp number already exists.' });
//       }
//     }

//     if(cleanedData.email){
//       const existingEmail = await Customer.findOne({ email, _id: { $ne: id } });
//       if (existingEmail) {
//         return res.status(400).json({ message: 'A customer with this email already exists.' });
//       }
//     }

    


//     // Update the customer in the database
//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       req.params.id,
//       cleanedData,
//       { new: true } 
//     );

//     // Check if the customer was found and updated
//     if (!updatedCustomer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // Update customerDisplayName in associated Account documents
//     if ( cleanedData.fullName !== existingCustonmer.fullName) {
//       const updatedAccount = await Account.updateMany(
//         {
//           accountName: existingCustonmer.fullName,
//         },
//         { $set: { accountName: cleanedData.fullName } }
//       );
//       console.log(
//         `${updatedAccount.modifiedCount} account(s) associated with the accountName have been updated with the new customerDisplayName.`
//       );
//     }


//     res.status(200).json({ 
//       message: 'Customer Edited successfully',
//       data: updatedCustomer,
//     });    
//   } catch (error) {
//     console.error("Error updating customer:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };










exports.updateCustomerById = async (req, res) => {
  try {
    console.log("Update Customer:", req.body);
    const { id } = req.params;

    // Handle location
    if (req.body.location) {
      if (typeof req.body.location === "object" && req.body.location !== null) {
        const { address = '', latitude, longitude } = req.body.location;

        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);

        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
          console.error("Invalid latitude or longitude");
          return res.status(400).json({ message: "Invalid latitude or longitude" });
        }

        req.body.location = {
          address,
          coordinates: {
            type: "Point",
            coordinates: [parsedLongitude, parsedLatitude],
          },
        };
      } else {
        console.warn("Invalid location object received, skipping location update");
        delete req.body.location;
      }
    }

    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Clean and sanitize customer data
    const cleanedData = cleanCustomerData(req.body);

    // Remove the stock field to prevent updating it
    delete cleanedData.stock;

    console.log("Cleaned Data:", cleanedData);

    if (cleanedData.depositAmount === "NaN") {
      cleanedData.depositAmount = 0;
    }

    if (!cleanedData.fullName) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    if (!cleanedData.customerType) {
      return res.status(400).json({ message: 'Select Customer Type.' });
    }

    // Check for unique WhatsApp number
    if (cleanedData.whatsappNumber) {
      const existingWhatsappNumber = await Customer.findOne({ whatsappNumber: cleanedData.whatsappNumber, _id: { $ne: id } });
      if (existingWhatsappNumber) {
        return res.status(400).json({ message: 'A customer with this WhatsApp number already exists.' });
      }
    }

    // Check for unique email
    if (cleanedData.email) {
      const existingEmail = await Customer.findOne({ email: cleanedData.email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'A customer with this email already exists.' });
      }
    }

    // Update the customer in the database
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      cleanedData,
      { new: true, runValidators: true } 
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update customerDisplayName in associated Account documents
    if (cleanedData.fullName && cleanedData.fullName !== existingCustomer.fullName) {
      // Update Accounts
      const updatedAccount = await Account.updateMany(
        { accountName: existingCustomer.fullName },
        { $set: { accountName: cleanedData.fullName } }
      );
      console.log(
        `${updatedAccount.modifiedCount} account(s) associated with the accountName have been updated.`
      );

      // Update TrialBalances
      console.log("existingCustomer.fullName:", existingCustomer.fullName);
      const updatedTrialBalance = await TrialBalance.updateMany(
        { operationId: id }, // Use the customer ID as the operationId
        { $set: { accountName: cleanedData.fullName } }
      );
      console.log(
        `${updatedTrialBalance.modifiedCount} trial balance record(s) associated with the accountName have been updated.`
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




exports.deleteCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;

    // Check if the customer has any unpaid balance
    const balanceResult = await Order.aggregate([
      { $match: { customerId: customerId } },
      { $group: { _id: null, totalBalance: { $sum: '$balanceAmount' } } }
    ]);

    const totalBalance = balanceResult[0]?.totalBalance || 0;

    if (totalBalance > 0) {
      return res.status(400).json({
        message: `Cannot delete customer due to unpaid balance of ${totalBalance}`,
      });
    }

    // Find and delete the customer
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete the associated account
    const deletedAccount = await Account.findOneAndDelete({ accountId: customerId });
    if (!deletedAccount) {
      console.warn(`Account not found for customerId: ${customerId}`);
    }

    // Delete the associated trial balance entries
    const deletedTrialEntries = await TrialBalance.deleteMany({ operationId: customerId });
    if (deletedTrialEntries.deletedCount === 0) {
      console.warn(`No trial balance entries found for customerId: ${customerId}`);
    }

    res.status(200).json({
      message: 'Customer, associated account, and trial balance entries deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting customer and related data:', error);
    res.status(500).json({ message: 'Error deleting customer and related data', error });
  }
};






// exports.createCouponCustomer = async (req, res) => {
//   try {
//     const { customerId, couponId,depositAccountId, paidAmount} = req.body;


//     if (!customerId || !couponId || !depositAccountId || !paidAmount) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const Customer = await Customer.findById(customerId)

//     if (!Customer) {
//       return res.status(404).json({ message: "Customer not found" })
//     }
//     const coupon = await Coupon.findById(couponId)

//     if (!coupon) {
//       return res.status(404).json({ message: "Coupon not found" })
//     }
//     const Accounts = await Accounts.findById(depositAccountId)

//     if (!Accounts) {
//       return res.status(404).json({ message: "Accounts not found" })
//     }


//     if(coupon.price!==paidAmount){
//       return res.status(400).json({ message: "Paid amount must be equal to coupon price" })
//     }

//     const { customerAccount, saleAccount, depositAccount } = await dataExist(customerId, depositAccountId);
//     if (!customerAccount) {
//       return res.status(404).json({ message: "Customer Account not found" });
//     }


//     let nextId = 1;
//     const lastPrefix = await couponCustomer.findOne().sort({ _id: -1 }); 
//     if (lastPrefix) {
//       const lastId = parseInt(lastPrefix.couponNumber.slice(7)); 
//       nextId = lastId + 1; 
//     }    
//     const couponNumber = `COUPON-${nextId}`;

//     const newCouponCustomer = new couponCustomer({ customerId, couponId,depositAccountId, paidAmount, couponNumber });
//     await newCouponCustomer.save();

//     await journal(newCouponCustomer, customerAccount, saleAccount, depositAccount);

//   }catch (error) {
//     console.error('Error creating coupon customer:', error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// }
  
  //Clean Data 
  
  
  
  
  
  
  exports.createCouponCustomer = async (req, res) => {
    try {
      const { customerId, couponId, depositAccountId, paidAmount } = req.body;
  
      console.log("Request Body:", req.body);
  
      // Validate required fields
      if (!customerId || !couponId || !depositAccountId || !paidAmount) {
        console.warn("Validation failed: Missing required fields");
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Find customer, coupon, and deposit account (using your respective models)
      const customer = await Customer.findById(customerId);
      console.log("Customer fetched:", customer);
      if (!customer) {
        console.warn("Customer not found for ID:", customerId);
        return res.status(404).json({ message: "Customer not found" });
      }
  
      const coupon = await Coupon.findById(couponId);
      console.log("Coupon fetched:", coupon);
      if (!coupon) {
        console.warn("Coupon not found for ID:", couponId);
        return res.status(404).json({ message: "Coupon not found" });
      }
  
      const accounts = await Accounts.findById(depositAccountId);
      console.log("Accounts fetched:", accounts);
      if (!accounts) {
        console.warn("Accounts not found for ID:", depositAccountId);
        return res.status(404).json({ message: "Accounts not found" });
      }
  
      // Check that the paid amount matches the coupon price
      if (coupon.price !== paidAmount) {
        console.warn("Paid amount mismatch. Expected:", coupon.price, "Received:", paidAmount);
        return res.status(400).json({ message: "Paid amount must be equal to coupon price" });
      }
  
      // Validate and retrieve additional account details
      const { customerAccount, saleAccount, depositAccount } = await dataExist(customerId, depositAccountId);
      console.log("Account Details:", { customerAccount, saleAccount, depositAccount });
      if (!customerAccount) {
        console.warn("Customer account not found for ID:", customerId);
        return res.status(404).json({ message: "Customer Account not found" });
      }
  
      // Generate the coupon number
      let nextId = 1;
      const lastPrefix = await couponCustomer.findOne().sort({ _id: -1 });
      console.log("Last CouponCustomer Prefix:", lastPrefix);
      if (lastPrefix && lastPrefix.couponNumber) {
        const lastId = parseInt(lastPrefix.couponNumber.slice(7));
        nextId = lastId + 1;
        console.log("Next Coupon Number ID:", nextId);
      }
      const couponNumber = `COUPON-${nextId}`;
  
      // Create a new couponCustomer document
      const newCouponCustomer = new couponCustomer({ 
        customerId, 
        couponId, 
        depositAccountId, 
        paidAmount, 
        couponNumber 
      });
      await newCouponCustomer.save();
      console.log("Coupon customer record created:", newCouponCustomer);
  
      // Update the customer's CouponBottle field by adding coupon.numberOfBottles.
      const bottlesToAdd = coupon.numberOfBottles || 0;
      console.log("Bottles to add to customer:", bottlesToAdd);
      customer.CouponBottle = (customer.CouponBottle || 0) + bottlesToAdd;
      await customer.save();
      console.log(`Updated customer ${customer._id} CouponBottle by adding ${bottlesToAdd}. New value: ${customer.CouponBottle}`);
  
      // Update journal entries
      await journal(newCouponCustomer, customerAccount, saleAccount, depositAccount);
      console.log("Journal updated successfully");
  
      res.status(201).json({ 
        message: "Coupon customer created successfully", 
        couponCustomer: newCouponCustomer 
      });
    } catch (error) {
      console.error('Error creating coupon customer:', error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  


  exports.getAllUniqueCouponCustomers = async (req, res) => {
    try {
      // Fetch all coupon-customer records
      const couponCustomers = await couponCustomer.find();
  
      const result = await Promise.all(
        couponCustomers.map(async (entry) => {
          const customer = await Customer.findById(entry.customerId, 'fullName');
          const coupon = await Coupon.findById(entry.couponId);
  
          return {
            customerFullName: customer ? customer.fullName : 'N/A',
            couponDetails: coupon || {},
            paidAmount: entry.paidAmount,
            couponNumber: entry.couponNumber,
            createdAt: entry.createdAt,
          };
        })
      );
  
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching coupon customer data',
        error: error.message,
      });
    }
  };
  
  
  
  
  
  exports.getAllCouponCustomers = async (req, res) => {
    try {
      const couponCustomers = await Customer.find({ paymentMode: 'Coupon' });
      res.status(200).json(couponCustomers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coupon customers', error });
    }
  };
  

 
  
  
  
  
  
  
  
  
  
  
  
  
  
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





async function journal(newCouponCustomer, customerAccount, saleAccount, depositAccounts) {
  const sale = {
    operationId: newCouponCustomer._id,
    transactionId: newCouponCustomer.couponNumber,
    date: newCouponCustomer.createdDate,
    accountId: saleAccount._id || undefined,
    action: "Coupon Invoice",
    debitAmount: 0,
    creditAmount: newCouponCustomer.paidAmount || 0,
    remark: newCouponCustomer.note,
  };

  const customer = {
    operationId: newCouponCustomer._id,
    transactionId: newCouponCustomer.couponNumber,
    date: newCouponCustomer.createdDate,
    accountId: customerAccount._id || undefined,
    action: "Coupon Invoice",
    debitAmount: newCouponCustomer.paidAmount || 0,
    creditAmount: 0,
    remark: newCouponCustomer.note,
  };

  const customerPaid = {
    operationId: newCouponCustomer._id,
    transactionId: newCouponCustomer.couponNumber,
    date: newCouponCustomer.createdDate,
    accountId: customerAccount._id || undefined,
    action: "Receipt",
    debitAmount: 0,
    creditAmount: newCouponCustomer.paidAmount || 0,
    remark: newCouponCustomer.note,
  };

  const depositAccount = {
      operationId: newCouponCustomer._id,
      transactionId: newCouponCustomer.couponNumber,
      date: newCouponCustomer.createdDate,
      accountId: depositAccounts._id || undefined,
      action: "Receipt",
      debitAmount: newCouponCustomer.paidAmount || 0,
      creditAmount: 0,
      remark: newCouponCustomer.note,
    };
  

  const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai", "DD/MM/YY", "/");
  const openingDate = generatedDateTime.dateTime;


    createTrialEntry(sale, openingDate);
    createTrialEntry(customer, openingDate);
    createTrialEntry(customerPaid, openingDate);
    createTrialEntry(depositAccount, openingDate);

}

  



  async function createTrialEntry( data,openingDate ) {
    const newTrialEntry = new TrialBalance({
        organizationId:data.organizationId,
        operationId:data.operationId,
        transactionId: data.transactionId,
        date:openingDate,
        accountId: data.accountId,
        action: data.action,
        debitAmount: data.debitAmount,
        creditAmount: data.creditAmount,
        remark: data.remark
  });
 const trial =  await newTrialEntry.save();



  
  console.log('output:',trial); 
  
  }





























exports.ensureAllCustomersHaveAccountsAndTrialBalances = async (req, res) => {
  try {
    const customers = await Customer.find();

    for (const customer of customers) {
      // Check if the customer has an associated account
      const existingAccount = await Account.findOne({ accountId: customer._id });
      if (!existingAccount) {
        // Create a new account for the customer
        const newAccount = new Account({
          accountName: customer.fullName,
          accountId: customer._id,
          openingDate: new Date(),
          accountSubhead: "Sundry Debtors",
          accountHead: "Asset",
          accountGroup: "Asset",
          description: "Customer",
        });
        await newAccount.save();
        console.log(`Created new account for customer: ${customer.fullName}`);
      }

      // Check if the customer has a trial balance entry
      const existingTrialBalance = await TrialBalance.findOne({ operationId: customer._id });
      if (!existingTrialBalance) {
        // Create a new trial balance entry for the customer
        const trialEntry = new TrialBalance({
          operationId: customer._id,
          date: new Date(),
          accountId: existingAccount ? existingAccount._id : null,
          accountName: customer.fullName,
          action: "Opening Balance",
          debitAmount: customer.depositAmount || 0,
          creditAmount: 0,
        });
        await trialEntry.save();
        console.log(`Created new trial balance entry for customer: ${customer.fullName}`);
      }
    }

    res.status(200).json({ message: 'Checked and ensured all customers have accounts and trial balances.' });
  } catch (error) {
    console.error('Error ensuring customers have accounts and trial balances:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};