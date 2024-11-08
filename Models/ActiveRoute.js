const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ActiveRouteSchema = new Schema({
    mainRoute: {
        type: String,
        required: true,
      },
    subRoute: {
        type: String,
        required: true
      },
    helper:{
        type:String,
        required:true
    },
    driver:{
        type:String,
        required:true
    },
    vehicleNo:{
        type:String,
        required:true
    },
    Salesman:{
        type:String,   
    },
    openingStock:{
        type:String,
        required:true
    },
    loadedStock:{
        type:String,
        required:true
    },
    totalStock:{
        type:String,
        required:true
    },
    startingKm:{
        type:String,
        required:true
    },

     
});

const ActiveRoute = mongoose.model('ActiveRoute', ActiveRouteSchema);
module.exports = ActiveRoute // Make sure this line is correct