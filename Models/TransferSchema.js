const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromRoute: {type: String },
  fromRouteId :{type: String },
  toRouteId :{type: String },
  toRoute: { type: String },
  filledBottlesTransferred: { type: Number, required: true },
  notes: {type: String},
  termsAndConditions: {type:String},
  transferNumber: { type: String },
   
  stock: [{
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
    status: { type: String, default: undefined }     
  }],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransferLog', transferSchema); 