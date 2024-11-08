// counterModel.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., "customerID"
  seq: { type: Number, default: 0 }     // Auto-increment value
});

module.exports = mongoose.model('Counter', counterSchema);
