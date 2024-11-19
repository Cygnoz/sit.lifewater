const mongoose = require("mongoose")
const Counter = require("./Counter") // Import the counter model

const customerSchema = new mongoose.Schema(
  {
    customerID: { type: String, unique: true },
    customerType: { type: String, required: true },
    logo: { type: String },
    fullName: { type: String, required: true },

    mobileNo: { type: Number, trim: true },
    whatsappNumber: { type: Number, trim: true },
    // email: { type: String, lowercase: true, trim: true },
    depositAmount: {type: String, lowercase: true, trim:true},
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    zipPostalCode: { type: String, trim: true },
    billingAddress: { type: String },
    landmark: { type: String, trim: true },
    flatNumber: { type: String, trim: true },

    nationality: { type: String, trim: true },

    mainRoute: { type: String, trim: true },
    subRoute: { type: String, trim: true },

    numberOfBottles: { type: Number },
    ratePerBottle: { type: Number },

    paymentMode: { type: String, enum: ["Cash", "Credit", "Coupon"] },

    location: {
      address: {
        type: String,
        // required: true
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          // default: 'Point'
        },
        coordinates: {
          type: [Number],// [longitude, latitude]
          // default:[0,0] 
          // required: true
        },
      },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Customer", customerSchema)
