const mongoose = require('mongoose');
 
const customerSchema = new mongoose.Schema({
  customerID: { type: String },
  customerType: { type: String, required: true },
  logo: { type: String }, 
  fullName: { type: String, required: true },

  mobileNo: { type: Number, trim: true },
  whatsappNumber: { type: Number, trim: true },
  email: { type: String, lowercase: true, trim: true },

  addressLine1: { type: String },
  addressLine2: { type: String },
  
  street: { type: String },
  city: { type: String },
  zipPostalCode: { type: String },
  flatNumber: { type: String },
    
  mainRoute: { type: String },
  subRoute: { type: String },
  
  numberOfBottles: { type: Number },
  ratePerBottle:{ type: Number },
    
  paymentMode: { type: String, enum: ['Cash','Credit','Coupon'] },

  location: {
    address: {
      type: String,
      // required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        // default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true
      }
    }
  }
},{ timestamps: true });

customerSchema.index({ 'location.coordinates': '2dsphere' });



 
module.exports = mongoose.model('Customer', customerSchema);