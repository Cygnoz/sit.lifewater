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
  price: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  itemImage: {
    type: String,  // Store image URL or path
    required: false
  }
}, { timestamps: true } );

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
