const Order = require('../Models/OrderSchema'); // Adjust the path as needed

// Function to add a new order
const createOrder = async (req, res) => {
  try {
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
    } = req.body;

    console.log(req.body);
    

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
const viewOrder = async (req, res) => {
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
const viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Function to delete an order by ID
const deleteOrder = async (req, res) => {
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

module.exports = {
  createOrder,
  viewOrder,
  viewAllOrders,
  deleteOrder
};