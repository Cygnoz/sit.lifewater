// const BusinessCustomer = require('../Models/BussinessCustomerSchema');
const axios = require('axios');
const Customer = require('../Models/CustomerSchema');
 
 
const createCustomer = async (req, res) => {
  try {
    const {
      customerType,
      companyName,
      companyWebsite,
      firstName,
      lastName,
      taxPreference,
      mobileNo,
      workPhone,
      workPhone2,
      whatsappNo,
      currency,
      currencyCode,
      placeOfSupply,
      state,
      city,
      area,
      zipPostalCode,
      billingAddress,
      email, // Now optional
      landmark,
      buildingNo,
      street,
      salesman,
      nationality,
      mainRoute,
      subRoute,
      noOfBottles,
      ratePerBottle,
      depositAmount,
      paymentMode
    } = req.body;

    console.log(req.body);

    // Validate required fields
    if (!firstName) {
      return res.status(400).json({ message: 'First name is required.' });
    }

    // Check for existing customer by WhatsApp number (unique identifier)
    const existingCustomer = await Customer.findOne({ whatsappNo });
    if (existingCustomer) {
      return res.status(400).json({ message: 'A customer with this WhatsApp number already exists.' });
    }

    // Create a new customer based on type
    const newCustomer = new Customer({
      customerType,
      companyName: customerType === 'Business' ? companyName : null,
      logo: req.file ? req.file.filename : null,
      companyWebsite,
      firstName,
      lastName,
      taxPreference,
      mobileNo,
      workPhone,
      workPhone2,
      whatsappNo,
      currency,
      currencyCode,
      placeOfSupply,
      state,
      city,
      area,
      zipPostalCode,
      billingAddress,
      email: email || null, // Set email to null if not provided
      landmark,
      buildingNo,
      street,
      salesman,
      nationality,
      mainRoute,
      subRoute,
      noOfBottles,
      ratePerBottle,
      depositAmount,
      paymentMode
    });

    const savedCustomer = await newCustomer.save();

    return res.status(201).json({
      message: 'Customer created successfully!',
      data: savedCustomer,
      status: 201
    });
  } catch (error) {
    console.error('Error creating customer:', error);

    return res.status(500).json({ message: 'Error creating customer', error });
  }
};


// Ensure correct path to your model

// Controller to add a customer from Salesman module
const addCustomerFromSalesman = async (req, res) => {
  try {
    const {
      customerType,
      companyName,
      firstName,
      lastName,
      email,
      numberOfBottles,
      rate,
      paymentMode,
      contactNumber,
      whatsappNumber,
      depositAmount,
      mainRoute,
      subRoute,
      location
    } = req.body;

    // Transform location only if it's provided and contains valid coordinates
    let transformedLocation;
    if (location && location.coordinates && location.coordinates.latitude && location.coordinates.longitude) {
      transformedLocation = {
        address: location.address || '', // Default to empty string if address is not provided
        coordinates: {
          type: "Point",
          coordinates: [location.coordinates.longitude, location.coordinates.latitude]
        }
      };
    }

    // Create a new customer document
    const newCustomer = new Customer({
      customerType,
      companyName,
      firstName,
      lastName,
      email,
      noOfBottles: numberOfBottles,
      ratePerBottle: rate,
      paymentMode,
      mobileNo: contactNumber,
      whatsappNo: whatsappNumber,
      depositAmount,
      mainRoute,
      subRoute,
      location: transformedLocation // This will be undefined if location is not provided
    });

    const response = await axios.post('https://account-api.dev.billbizz.cloud:5001/lw-account', { customerDisplayName: firstName });
    if (response.status === 201) {
      console.log('Customer added successfully to billbizz account');
    } else {
      console.error('Failed to add customer to billbizz account');
    }

    const savedCustomer = await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully', customer: savedCustomer, status: 201 });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Error adding customer', error: error.message });
  }
};





 
// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business customers', error });
  }
};
 
// Get a single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Business customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business customer', error });
  }
};
 
// Update a customer by ID
const updateCustomerById = async (req, res) => {
  try {
    // Clone the request body into updatedData
    let updatedData = { ...req.body };
    console.log('Updated Data:', updatedData);

    // Check if a file (logo) is uploaded and add it to updatedData
    if (req.file) {
      updatedData.logo = req.file.filename;
    }

    // Parse location if it's a string and transform it
    if (typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }

    if (req.body.location) {
      const { address, coordinates } = req.body.location;
      updatedData.location = {
        address,
        coordinates: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude] // [longitude, latitude]
        }
      };
    }

    // Update the customer in the database
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    // Check if the customer was found and updated
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Return the updated customer
    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ message: 'Error updating customer', error });
  }
};


// Controller to edit a customer from Salesman module
const editCustomerFromSalesman = async (req, res) => {
  try {
    const { id } = req.params;  // Customer ID from request parameters
    const {
      customerType,
      companyName,
      firstName,
      lastName,
      email,
      numberOfBottles,
      rate,
      paymentMode,
      contactNumber,
      whatsappNumber,
      depositAmount,
      mainRoute,
      subRoute,
      location
    } = req.body;

    // Transform location only if it's provided
    const transformedLocation = location ? {
      address: location.address,
      coordinates: {
        type: "Point",
        coordinates: [location.coordinates.longitude, location.coordinates.latitude]
      }
    } : undefined;

    // Update customer data, including location if provided
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        customerType,
        companyName,
        firstName,
        lastName,
        email,
        noOfBottles: numberOfBottles,
        ratePerBottle: rate,
        paymentMode,
        mobileNo: contactNumber,
        whatsappNo: whatsappNumber,
        depositAmount,
        mainRoute,
        subRoute,
        ...(transformedLocation && { location: transformedLocation })
      },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};




 
// Delete a business customer by ID
const deleteCustomerById = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting business customer', error });
  }
};

  
module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  addCustomerFromSalesman,
  editCustomerFromSalesman
};
