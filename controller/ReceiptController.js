const Receipt = require('../Models/receiptSchema');
const Order = require('../Models/OrderSchema');
const Customer = require('../Models/CustomerSchema');
const TrialBalance = require('../Models/trialBalance');
const Account = require('../Models/account');

// Helper function to clean incoming data
const cleanData = (data) => {
  const cleanedData = {};
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      cleanedData[key] = data[key];
    }
  }
  return cleanedData;
};

exports.createReceipt = async (req, res) => {
  try {
    let { customerId, orderId, paidAmount, depositAccountId } = cleanData(req.body);

    // Validate essential fields with specific error messages
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }
    if (!paidAmount && paidAmount !== 0) {
      return res.status(400).json({ message: 'Paid amount is required.' });
    }
    if (paidAmount <= 0) {
      return res.status(400).json({ message: 'Paid amount must be greater than zero.' });
    }
    if (!depositAccountId) {
      return res.status(400).json({ message: 'Deposit account ID is required.' });
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Validate customer association with the order
    if (order.customerId.toString() !== customerId) {
      return res.status(400).json({ message: 'Order does not belong to the specified customer.' });
    }

    // Check if the paid amount exceeds the balance
    if (paidAmount > order.balanceAmount) {
      return res.status(400).json({ message: 'Paid amount exceeds the balance amount.' });
    }

    // Decrement the balance amount from the order
    order.balanceAmount -= paidAmount;
    await order.save();

    // Create a new receipt entry
    const receipt = new Receipt({
      customerName: order.customerName,
      customerId,
      orderId,
      orderNumber: order.orderNumber,
      depositAccountId,
      paidAmount,
    });

    await receipt.save();

    return res.status(201).json({
      message: 'Receipt created successfully.',
      receipt,
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
