const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    warehouseName: {
        type: String,
        // required: true,
        trim: true
    },
    contactNo: {
        type: String,
        // required: true,
        trim: true
    },
    address: {
        type: String,
        // required: true,
        trim: true
    }
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;