const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
    itemId: { type: String },
    quantity: { type: Number },
    status: { type: String, default: undefined },
  }, { _id: false });
  

const warehouseSchema = new mongoose.Schema({
    warehouseName: { type: String },
    contactNo: { type: String },
    address: { type: String },
    stock:[stockSchema]
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;