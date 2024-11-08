const mongoose = require('mongoose');

const businessCustomerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  taxPreference: {
    type: String,
    enum: ['inclusive', 'exclusive']
  },
  mobileNo: {
    type: String,
    trim: true
  },
  workPhone: {
    type: String,
    trim: true
  },
  workPhone2: {
    type: String,
    trim: true
  },
  whatsappNo: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    trim: true
  },
  placeOfSupply: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  zipPostalCode: {
    type: String,
    trim: true
  },
  billingAddress: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  buildingNo: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    trim: true
  },
  salesman: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  },
  mainRoute: {
    type: String,
    trim: true
  },
  subRoute: {
    type: String,
    trim: true
  },
  noOfBottles: {
    type: Number
  },
  depositAmount: {
    type: Number
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Credit']
  }
});

const BusinessCustomer = mongoose.model('BusinessCustomer', businessCustomerSchema);

module.exports = BusinessCustomer;