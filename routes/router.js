const express = require("express")
const router = express.Router()
const staffController = require("../controller/staffController")
const vehicleController = require("../controller/VehicleController")
const mainRouteController = require("../controller/RouteController")
const subrouteController = require('../controller/SubRouteController');
const CustomerController = require("../controller/CustomerController")

const upload = require("../middleware/Multermiddleware")
const ActiveRouteController = require("../controller/ActiveRouteController")
const EndRideController = require('../controller/EndRideController')

// STAFF

// Add staff
router.post("/addstaff", upload.single("profile"), staffController.addStaff)
// Get all staff
router.get("/getallstaffs", staffController.getAllStaff)
// Get staff by ID
router.get("/staff/:id", staffController.getStaffById)
// Edit staff
router.put("/staff/:id", upload.single("profile"), staffController.editStaff)
// Delete staff
router.delete("/staff/:id", staffController.deleteStaff)
//login staff(sales)
router.post("/staff/login", staffController.loginSalesStaff)

// VEHICLE
// Add vehicle
router.post("/addVehicle", upload.single("vehicleImage"), vehicleController.addVehicle)
// view vehicle
router.get("/viewVehicles", vehicleController.getAllVehicles)
// view single vehicle
router.get("/viewvehicle/:id", vehicleController.viewVehicleById)
// edit vehicle
router.put("/editvehicle/:id", upload.single("image"), vehicleController.updateVehicle)
// delete vehicle
router.delete("/deletevehicle/:id", vehicleController.deleteVehicle)

// // ROUTE

// Route endpoints
router.post('/addRoute', mainRouteController.addRoute);
router.delete('/delRoute/:id', mainRouteController.deleteRoute);    // Delete route by ObjectId
router.put('/updateRoute/:id', mainRouteController.updateRoute);       // Update route by ObjectId
router.get('/getAllRoutes' ,mainRouteController.getAllRoutes)        // View all routes
router.get('/getroute/:id', mainRouteController.viewRouteById);     // View route by ObjectId

// subroute
router.post('/addSRoute', subrouteController.addSubroute);
router.put('/updateSRoute/:id', subrouteController.editSubroute);
router.delete('/delSRoute/:id', subrouteController.deleteSubroute);
router.get('/viewSRoute', subrouteController.viewAllSubroutes);
router.get('/viewSRoute/:id', subrouteController.viewSubroute);
router.get('/getSRoute/:id', subrouteController.getSubroutebyID);

// MainRoute routes
// router.post("/main-route", mainRouteController.addRoute)
// router.get("/main-route", mainRouteController.getAllRoutes)
// router.get("/main-route/:id", mainRouteController.viewRouteById)
// router.put("/main-route/:id", mainRouteController.updateRoute)
// router.delete("/main-route/:id", mainRouteController.deleteRoute)

// SubRoute route to add a sub-route to a main route
// router.post("/main-route/:mainRouteId/sub-route", mainRouteController.addSubRoute)

//customer
router.post("/addcustomer", upload.single("logo"), CustomerController.createCustomer)
router.get("/customer", CustomerController.getAllCustomers)
router.post('/addsalesmancustomer',CustomerController.addCustomerFromSalesman);
router.put("/editcustomer/:id", upload.single("logo"), CustomerController.updateCustomerById)
router.put('/editcustomer/:id',CustomerController.editCustomerFromSalesman);
router.get("/customer/:id", CustomerController.getCustomerById)
router.put("/editcustomer/:id", upload.single("logo"), CustomerController.updateCustomerById)
router.delete("/customer/:id", CustomerController.deleteCustomerById)

// Active Route
router.post("/activroutes", ActiveRouteController.createActiveRoute)
router.get("/getActiveRoutes", ActiveRouteController.getActiveRoutes)
router.get("/viewActiveRoute/:id", ActiveRouteController.viewActiveRouteById)


//endride
router.post('/end-ride', EndRideController.endRide);
router.get('/getallendride', EndRideController.getEndRide);

module.exports = router
