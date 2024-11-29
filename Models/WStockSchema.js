const mongoose = require('mongoose');

const wStockSchema = new mongoose.Schema({
  warehouse:{ type: String },
  transferNumber: { type: String },
  date: { type: Date, default: Date.now },
  items: [{
    itemName: { type: String },
    quantity: { type: Number, min: 0 },
    amount: { type: Number, min: 0 },
    rate: { type: Number, min: 0 },   
    itemImage: { type: String },
  }],
  
  notes: { type: String },
  termsAndConditions: { type: String }
});


const WStock = mongoose.model('WStock', wStockSchema);

module.exports = WStock;