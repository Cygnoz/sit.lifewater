const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stockSchema = new Schema({
  itemId: { type: String },
  itemName: { type: String },
  quantity: { type: Number },
  status: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  // Order identification
  orderNumber: {
    type: String,
    trim: true
  },
  mainRouteName:{
    type:String,
  },
  mainRouteId:{
    type:String,
  },
  subRouteName:{
    type:String,
  },
  subRouteId:{
    type:String,
  },
  customerId: {
    type:String,
  },
  salesman: {
    type:String,
  },
  // Order details
  date: {
    type: Date,
    // required: true,
    default: Date.now
  },
  paymentMode: {
    type: String,
    // required: true,
    enum: ['Cash', 'Credit', 'FOC']
  },
  // Additional information
  notes: {
    type: String,
    trim: true
  },
  termsAndCondition: {
    type: String,
    trim: true
  },
  ReturnBottle: {
    type:Number
  },
  ratePerItem: {
    type: String,
  },
  // Calculations
  totalAmount: {
    type: Number,
    // required: true,
  },
  stock: { type: [stockSchema], default: undefined }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;