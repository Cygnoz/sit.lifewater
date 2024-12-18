const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 

const stockSchema = new Schema({
  itemId: { type: String },
  itemName: { type: String },
  quantity: { type: Number },
  status: { type: String },
}, { _id: false });
 
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
  depositAmount:{type:Number},
  numberOfBottles: { type: Number },
  ratePerBottle:{ type: Number },
  paymentMode: { type: String, enum: ['Cash','Credit','Coupon'] },
  resaleItemQuantity:{type:Number},
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
  },
  stock: { type: [stockSchema], default: undefined }

},{ timestamps: true });

customerSchema.index({ 'location.coordinates': '2dsphere' });



 
module.exports = mongoose.model('Customer', customerSchema);