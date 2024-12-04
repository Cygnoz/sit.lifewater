const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  username: { type: String },
  password: {type: String },
  profile: { type: String },
  address: { type: String },
  visaStatus: { type: String, enum: ['Valid', 'Expired', 'In Process'] },
  visaValidity: { type: Date },
  mobileNumber: { type: String },
  whatsAppNumber: { type: String },
  visaNumber: { type: String },
  dateofBirth: { type: Date },
  nationality: { type: String },
  designation: { type: String, enum: ['Sales', 'Driver', 'Helper'] },
  emiratesId: { type: String }
});

// Pre-save hook to hash the password before saving

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
