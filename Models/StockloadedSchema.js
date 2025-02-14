const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  mainRouteId: { type: String },
  mainRouteName: { type: String },
  
  subRouteId: { type: String },
  subRouteName: { type: String },
  
  warehouseId: { type: String },
  warehouseName: { type: String },
  
  date: { type: Date, default: Date.now },
  transferNumber: { type: String },
   
  stock: [{
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
    serialNumber: { type: String },
    sellingPrice: {type:Number},
    status: { type: String, default: undefined }     
  }],

  notes: { type: String },
  termsAndConditions: { type: String }
});


module.exports = mongoose.model('Stock', stockSchema);