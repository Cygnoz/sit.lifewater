const mongoose = require('mongoose');
const Counter = require('./Counter'); // Import the counter model
 
const customerSchema = new mongoose.Schema({
  customerID: {
    type: String,
    unique: true
  },
  customerType: {
    type: String,
    enum: ['Business', 'Individual'],
    required: true
  },
  companyName: {
    type: String,
    trim: true,
    required: function () {
      return this.customerType === 'Business';
    }
  },
  logo: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  taxPreference: {
    type: String,
    enum: ['inclusive', 'exclusive']
  },
  mobileNo: {
    type: String,
    trim: true
  },
  workPhone: {
    type: String,
    trim: true
  },
  workPhone2: {
    type: String,
    trim: true
  },
  whatsappNo: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    trim: true
  },
  currencyCode: {
    type: String,
  },
  placeOfSupply: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  zipPostalCode: {
    type: String,
    trim: true
  },
  billingAddress: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  buildingNo: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    trim: true
  },
  salesman: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  },
  mainRoute: {
    type: String,
    trim: true
  },
  subRoute: {
    type: String,
    trim: true
  },
  noOfBottles: {
    type: Number
  },
  ratePerBottle:{
    type: Number
  },
  depositAmount: {
    type: Number
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Credit','Coupon']
  },
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

// Pre-save hook to auto-generate customerID
customerSchema.pre('save', async function (next) {
  if (!this.isNew) return next(); // Only generate ID for new documents

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: 'customerID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.customerID = `LW-${String(counter.seq).padStart(3, '0')}`; // Format: LW-001, LW-002, etc.
    next();
  } catch (error) {
    next(error);
  }
});

 
module.exports = mongoose.model('Customer', customerSchema);
 
