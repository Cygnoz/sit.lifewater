// Importing Mongoose
const mongoose = require('mongoose');

// Defining the Coupon Schema
const CouponSchema = new mongoose.Schema({
  couponName: {
    type: String,
  },
  price: {
    type: Number,
  },
  numberOfBottles: {
    type: Number,

  }
}, {
  timestamps: true
});

// Exporting the model
const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;

