const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  remarks: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});

const EndRideSchema = new Schema({
  endingKM: {
    type: String,
    required: true,
  },
  travelledKM: {
    type: String,
    required: true,
  },
  salesMan: {
    type: String,
  },
  driver: {
    type: String,
  },
  vehicleNo: {
    type: String,
  },
  mainRoute: {
    type: String,
  },
  stock: {
    type: String,
  },
  subRoute: {
  type:  String
  },
  expenses: [ExpenseSchema], // Array of expense items
  activeRouteId: {
    type: Schema.Types.ObjectId,
    ref: 'ActiveRoute', // Reference to ActiveRoute
    required: true,
  },
},{ timestamps: true });

const EndRide = mongoose.model('EndRide', EndRideSchema);
module.exports = EndRide;
