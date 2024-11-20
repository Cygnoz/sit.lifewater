const Order = require('../Models/OrderSchema'); 


// Function to add a new order
exports.createOrder = async (req, res) => {
  console.log("Create Order:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);

    const {
      orderNumber,
      customer,
      salesman,
      warehouse,
      date,
      paymentMode,
      items,
      notes,
      termsAndCondition,
      status
    } = cleanedData;


    

    // Validate required fields
    if (!customer || !salesman || !warehouse || !items || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new order object
    const newOrder = new Order({
      orderNumber,
      customer,
      salesman,
      warehouse,
      date: date || Date.now(),
      paymentMode,
      items,
      notes: notes || '',
      termsAndCondition: termsAndCondition || '',
      status: status || 'draft'
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Function to view a single order by ID
exports.viewOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Function to view all orders
exports.viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Function to delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
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