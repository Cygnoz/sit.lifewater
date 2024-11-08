const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  // Order identification
  orderNumber: {
    type: String,
    // required: true,
    // unique: true,
    trim: true
  },
  
  // References
  customer: {
    type:String,
    // type: Schema.Types.ObjectId,
    // required: true
  },
  salesman: {
    type:String,
    // type: Schema.Types.ObjectId,
    // required: true
  },
  warehouse:{
    type: String,
    // required: true
  },

  // Order details
  date: {
    type: Date,
    // required: true,
    default: Date.now
  },
  paymentMode: {
    type: String,
    // required: true,
    enum: ['Cash', 'Credit', 'FOC']
  },

  // Items/Products in order
  items: [{
    itemName: {
      type: String,
    //   required: true
    },
    itemImage: {
      type: String, // URL or path to the image
    },
    quantity: {
      type: Number,
    //   required: true,
      min: 0,
      default: 1
    },
    price: {
      type: Number,
    //   required: true,
    //   min: 0
    },
    amount: {
      type: Number,
    //   required: true,
    //   min: 0
    },
 
  }],

  // Additional information
  notes: {
    type: String,
    trim: true
  },
  termsAndCondition: {
    type: String,
    trim: true
  },

  // Calculations
  totalAmount: {
    type: Number,
    // required: true,
  },

});

// // Calculate total amount before saving
// orderSchema.pre('save', function(next) {
//   // Calculate total from items
//   this.totalAmount = this.items.reduce((sum, item) => {
//     return sum + (item.quantity * item.price);
//   }, 0);
  
//   // Round to 2 decimal places
//   this.totalAmount = Number(this.totalAmount.toFixed(2));
  
//   next();
// });

// // Calculate item amount before saving
// orderSchema.pre('save', function(next) {
//   this.items.forEach(item => {
//     item.amount = Number((item.quantity * item.price).toFixed(2));
//   });
//   next();
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;