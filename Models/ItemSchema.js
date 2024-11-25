const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: { type: String },
  sku: { type: String },

  costPrice: { type: Number },
  sellingPrice: { type: Number },

  category:  {  type: String }, // Resaleable, Non-Resaleable
  description: {  type: String },
  itemImage: { type: String },
  createdAt: { type: Date, default: Date.now },

  status: { type: [String] },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
