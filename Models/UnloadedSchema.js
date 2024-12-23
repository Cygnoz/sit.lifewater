const mongoose = require('mongoose');
// const Warehouse = require('./WarehouseSchema');

const unloadSchema = new mongoose.Schema({

  subRouteName: {
    type: String,
  },
  subRouteId: {
    type: String,
    },
  warehouseName: {
    type: String,
  },
  warehouseId: {
    type: String,
    },
  date: {
    type: Date,
    default: Date.now
  },
  transferNumber: {
    type: String,
  },
  stock: [{
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
    status: { type: String, default: undefined }     
  }],
  notes:{ 
    type: String,
    },
  termsAndConditions:{
    type: String
  }
});

module.exports = mongoose.model('Unload', unloadSchema);