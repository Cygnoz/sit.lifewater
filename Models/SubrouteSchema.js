const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MainRoute = require('./MainRouteSchema'); 

const stockSchema = new Schema({
  itemId: { type: String },
  itemName: { type: String },
  quantity: { type: Number },
  status: { type: String },
  returnBottle: {type :Number}
}, { _id: false });

 
const subRouteSchema = new Schema({
  subRouteName: { type: String },
  subrouteCode: { type: String },
  description: { type: String },
  mainRouteId: { type: Schema.Types.ObjectId, ref: 'MainRoute' },
  // returnBottle: {type :Number},
  stock: { type: [stockSchema] }
});

const SubRoute = mongoose.model('SubRoute', subRouteSchema);
module.exports = SubRoute;
