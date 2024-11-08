const mongoose = require('mongoose');

const wStockSchema = new mongoose.Schema({
  warehouse:{
    type: String,
    // required: true
  },
  transferNumber: {
    type: String,
    // required: true,
    unique: true
  },
  date: {
    type: Date,
    // required: true,
    default: Date.now
  },
  items: [{
    itemName: {
      type: String,
    //   required: true
    },
    quantity: {
      type: Number,
    //   required: true,
      min: 0
    },
    amount: {
      type: Number,
    //   required: true,
      min: 0
    },
    rate: {
      type: Number,
    //   required: true,
      min: 0
    },   
    itemImage: {
      type: String,
    //   required: true
    },
  }],
  
  notes: {
    type: String
  },
  termsAndConditions: {
    type: String
  }
});


const WStock = mongoose.model('WStock', wStockSchema);

module.exports = WStock;