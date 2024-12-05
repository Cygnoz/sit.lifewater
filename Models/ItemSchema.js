// v1.0
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: { type: String },
  sku: { type: String },

  costPrice: { type: Number },
  sellingPrice: { type: Number },

  resaleable: { type: Boolean, default: false },
  description: {  type: String },
  itemImage: { type: String },
  createdAt: { type: Date, default: Date.now },

});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
