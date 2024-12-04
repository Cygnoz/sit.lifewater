const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String },
  image: { type: String },
  insuranceValidity: { type: Date },
  insuranceStatus: { type: String, enum: ['Valid', 'Expired'], default:'Valid' },
  registrationValidity: { type: Date },
  insuranceAmount: { type: Number },
  licenseAmount: { type: Number },
  licenseValidity: { type: Date },
  startingKilometer: { type: Number },
  expenses: { type: Number }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports =Vehicle
