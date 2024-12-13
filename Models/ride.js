const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stockSchema = new Schema({
    itemId: { type: String },
    itemName: { type: String },
    quantity: { type: Number },
    status: { type: String },
  }, { _id: false });

const RideSchema = new Schema({
    mainRouteId: { type: String },
    mainRouteName: { type: String },

    subRouteId: { type: String },
    subRouteName: { type: String },

    helperId:{ type:String },
    helperName:{ type:String },

    driverId:{ type:String },
    driverName:{ type:String },

    salesmanId:{ type:String },
    salesmanName:{ type:String },
    
    vehicleNo:{ type:String },
    startingKm:{ type:String },

    stock: { type: [stockSchema], default: undefined },
    status: { type: String, default: 'active' },
});


module.exports = mongoose.model('Ride', RideSchema);