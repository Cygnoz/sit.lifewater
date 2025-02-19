const mongoose = require('mongoose');

const wStockSchema = new mongoose.Schema({
  warehouse:{ type: String },
  transferNumber: { type: String },
  supplierId:{ type: String },
  supplierName:{ type: String },
  paidThroughAccountId: { type: String },
  paymentMode:{ type: String },
  paidAmount: { type: Number },
  totalAmount: { type: Number },
  balanceAmount: { type: Number },
  date: { type: Date, default: Date.now },
  items: [{
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number, min: 1 },
    costPrice: { type: Number },
    sellingPrice: { type: Number },
    amount: { type: Number },
    status: { type: String ,default: undefined}
  }],
   
  notes: { type: String },
  termsAndConditions: { type: String }
});


const WStock = mongoose.model('WStock', wStockSchema);

module.exports = WStock;