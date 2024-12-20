const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Stock Schema
const stockSchema = new Schema({
  itemId: { type: String },
  itemName: { type: String },
  quantity: { type: Number },
  status: { type: String },
}, { _id: false });

// Define Expense Schema
const expenseSchema = new Schema({
  remarks: { type: String },
  amount: { type: Number }
}, { _id: false });

// Define Ride Schema
const RideSchema = new Schema({
  mainRouteId: { type: String },
  mainRouteName: { type: String },
  subRouteId: { type: String },
  subRouteName: { type: String },
  helperId: { type: String },
  helperName: { type: String },
  driverId: { type: String },
  driverName: { type: String },
  salesmanId: { type: String },
  salesmanName: { type: String },
  vehicleNumber: { type: String },
  startingKm: { type: String },
  endingKM: {type: Number},
  travelledKM: {type: Number},
  stock: { type: [stockSchema], default: undefined },
  expenses: { type: [expenseSchema], default: undefined }, // Added Expense Schema Array
  status: { type: String, default: 'active' },
  date:{type:Date.now()}
});

module.exports = mongoose.model('Ride', RideSchema);
