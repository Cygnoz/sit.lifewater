const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromRoute: {
    type: String,
    required: true
  },
  toRoute: {
    type: String,
    required: true
  },
  filledBottlesTransferred: {
    type: Number,
    required: true
  },
  date: {
    type: Date,

    default: Date.now
  }
});

module.exports = mongoose.model('TransferLog', transferSchema);