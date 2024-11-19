const express = require("express");
const router = express.Router();
const staffController = require("../controller/staffController");
const vehicleController = require("../controller/VehicleController");
const mainRouteController = require("../controller/RouteController");
const subrouteController = require('../controller/SubRouteController');
const CustomerController = require("../controller/CustomerController");
const journalController = require('../controller/manualJournal');
const accountController = require("../controller/accountController");

const ActiveRouteController = require("../controller/ActiveRouteController")
const EndRideController = require('../controller/EndRideController')

// STAFF

// Add staff
router.post("/addstaff", staffController.addStaff)
// Get all staff
router.get("/getallstaffs", staffController.getAllStaff)
// Get staff by ID
router.get("/staff/:id", staffController.getStaffById)
// Edit staff
router.put("/staff/:id",  staffController.editStaff)
// Delete staff
router.delete("/staff/:id", staffController.deleteStaff)
//login staff(sales)
router.post("/staff/login", staffController.loginSalesStaff)

// VEHICLE
// Add vehicle
router.post("/addVehicle",  vehicleController.addVehicle)
// view vehicle
router.get("/viewVehicles", vehicleController.getAllVehicles)
// view single vehicle
router.get("/viewvehicle/:id", vehicleController.viewVehicleById)
// edit vehicle
router.put("/editvehicle/:id",  vehicleController.updateVehicle)
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
router.post("/addcustomer", CustomerController.createCustomer)
router.get("/customer", CustomerController.getAllCustomers)
router.put("/editcustomer/:id",CustomerController.updateCustomerById)
router.get("/customer/:id", CustomerController.getCustomerById)
router.delete("/customer/:id", CustomerController.deleteCustomerById)

// Active Route
router.post("/activroutes", ActiveRouteController.createActiveRoute)
router.get("/getActiveRoutes", ActiveRouteController.getActiveRoutes)
router.get("/viewActiveRoute/:id", ActiveRouteController.viewActiveRouteById)


//endride
router.post('/end-ride', EndRideController.endRide);
router.get('/getallendride', EndRideController.getEndRide);



//Accounts


router.post('/add-account',accountController.addAccount);

router.get('/get-all-account',accountController.getAllAccount);

router.get('/get-one-account/:accountId',accountController.getOneAccount);

router.put('/edit-account/:accountId',accountController.editAccount);

router.delete('/delete-account/:accountId',accountController.deleteAccount);

router.get('/auto-generate-account',accountController.autoGenerateAccount);




//Journal

router.post('/add-journal-entry',journalController.addJournalEntry);

router.get('/get-all-journal',journalController.getAllJournal);

router.get('/get-one-journal/:id',journalController.getOneJournal);





//Trial Balance

router.get('/get-one-trial-balance/:accountId',accountController.getOneTrailBalance)

module.exports = router
