const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  SKU: {
    type: String,
    required: true,
    unique: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  retailPrice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  itemImage: {
    type: String, // URL or path to the image
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
