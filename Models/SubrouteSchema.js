const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MainRoute = require('./RouteSchema'); // Importing the Route schema

const subRouteSchema = new Schema({
  subRoute: {
    type: String,
    required: true
  },
  subrouteCode: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  description: {
    type: String
  },
  mainRoute: {
    type: String,
    required: true,
    ref: 'MainRoute'  // Reference to Route schema's routeCode
  }
});

const SubRoute = mongoose.model('SubRoute', subRouteSchema);
module.exports = SubRoute;
