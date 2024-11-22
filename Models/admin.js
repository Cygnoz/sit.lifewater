const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({

  username: { type: String },
  password: { type: String },
 
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
