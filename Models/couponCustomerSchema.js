const mongoose = require('mongoose');

const couponCustomerSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  depositAccId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accounts',
    required: true
  },
  paidAmount: {
    type: Number,
  },
  couponNumber:{
    type:String    //prefix
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CouponCustomer', couponCustomerSchema);