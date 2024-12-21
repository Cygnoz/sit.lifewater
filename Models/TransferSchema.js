const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromRoute: {type: String },
  fromRouteId :{type: String },
  toRouteId :{type: String },
  toRoute: { type: String },
  filledBottlesTransferred: { type: Number, required: true },
  notes: {type: String},
  termsAndConditions: {type:String},
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransferLog', transferSchema); 