const mongoose = require("mongoose")

const SupplierSchema = new mongoose.Schema({

  companyName: {
    type: String,
  },
  vendorWebsite: {
    type: String,
  },
  paymentTerms: {
    type: String,
  },

  firstName: { type: String },
  lastName: { type: String },

  mobileNumber: {
    type: String,
    required: true,
  },
  customerPhone: {
    workPhone01: { type: String },
    workPhone02: { type: String },
  },
  currency: {
    type: String,
    default: "AED",
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  vendorEmail: {
    type: String,
  },
  taxPreference: {
    type: String,
  },
  zipPostalCode: {
    type: String,
  },
  placeOfSupply: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  area: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
})

const Supplier = mongoose.model("Supplier", SupplierSchema)
module.exports = Supplier
