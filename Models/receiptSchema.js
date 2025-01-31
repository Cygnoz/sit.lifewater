const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  customerName: {
    type: String,
    // required: true,
  },
  customerId: {
    type: String,
    // required: true,
  },
  orderId: {
    type: String,
    // required: true,
  },
  orderNumber: {
    type: String,
    // required: true,
  },
  depositAccountId: {
    type: String,
    // required: true,
  },
  paidAmount: {
    type: Number,
    // required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
