const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNo: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    // required: true
  },
  insuranceValidity: {
    type: Date,
    // required: true
  },
  insuranceStatus: {
    type: String,
    enum: ['Valid', 'Expired'],
    default:'Valid',
    required: true,
  },
  registrationValidity: {
    type: Date,
    // required: true
  },
  insuranceAmount: {
    type: Number,
    // required: true
  },
  licenseAmount: {
    type: Number,
    // required: true
  },
  licenseValidity: {
    type: Date,
    // required: true
  },
  startingKilometer: {
    type: Number,
    required: true
  },
  expenses: {
    type: Number,
    // required: true
  }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports =Vehicle
