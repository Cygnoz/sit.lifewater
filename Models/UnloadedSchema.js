const mongoose = require('mongoose');
// const Warehouse = require('./WarehouseSchema');

const unloadSchema = new mongoose.Schema({

  mainRoute: {
    type: String,
  },
  warehouseName: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  transferNumber: {
    type: String,
  },
  items: [{
    itemName: String,
    quantity: Number,
    amount:String,
    rate:String
  }],
  autoNotes: String,
  termsAndConditions: String
});

module.exports = mongoose.model('Unload', unloadSchema);