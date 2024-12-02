const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  mainRouteName: { type: String },
  mainRouteCode: { type: String },
  description: { type: String }
});

const MainRoute = mongoose.model('MainRoute', routeSchema);
module.exports = MainRoute 
