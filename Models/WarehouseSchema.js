const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
    costPrice:{type:Number},
    amount:{type:Number},
    status: { type: String, default: "filled" },
  }, { _id: false });
  

const warehouseSchema = new mongoose.Schema({
    warehouseName: { type: String },
    contactNo: { type: String },
    address: { type: String },
    stock:[stockSchema]
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;