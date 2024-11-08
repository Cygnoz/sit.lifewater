const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    // required: true,
    // unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mainRoute: {
    type: String,
  },
  subRoute: {
    type: String,
  },
  warehouse: {
    type: String,
  },
  items: [{
    itemName: {
      type: String,
    },
    quantity: {
      type: Number,
      min: 0
    },
    amount: {
      type: Number,
      min: 0
    },
    rate: {
      type: Number,
      min: 0
    }  
    
  }],

  notes: {
    type: String
  },
  
  termsAndConditions: {
    type: String
  }

});

// Virtual for calculating total stock
// stockSchema.virtual('calculatedTotalStock').get(function() {
//   return this.items.reduce((total, item) => total + item.totalQuantity, 0);
// });

// //Pre-save hook to update totalStock
// stockSchema.pre('save', function(next) {
//   this.totalStock = this.calculatedTotalStock;
//   next();
// });

module.exports = mongoose.model('Stock', stockSchema);