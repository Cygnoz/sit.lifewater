
const express = require("express")
const router = express.Router()


const AccountsController = require('../controller/Accounts/accountController')
const journalController = require('../controller/Accounts/journalController');

const ActiveRouteController = require("../controller/Route/ActiveRouteController")
const EndRideController = require('../controller/Route/EndRideController')
const mainRouteController = require("../controller/Route/MainRouteController")
const subrouteController = require('../controller/Route/SubRouteController');
const vehicleController = require("../controller/Route/VehicleController")

const AdminController = require('../controller/User/admin')
const CustomerController = require("../controller/User/CustomerController")
const staffController = require("../controller/User/staffController")

const { verifyToken } = require('../middleware/auth');



// STAFF
router.post("/addstaff", verifyToken, staffController.addStaff) // add staff
router.get("/getallstaffs", verifyToken, staffController.getAllStaff) // get all staff
router.get("/staff/:id", verifyToken, staffController.getStaffById) // get staff by ID
router.put("/staff/:id", verifyToken,  staffController.editStaff) // edit staff
router.delete("/staff/:id", verifyToken, staffController.deleteStaff) // delete staff
router.post("/staff/login", verifyToken, staffController.loginSalesStaff) // login staff(sales)


// VEHICLE
router.post("/addVehicle", verifyToken,  vehicleController.addVehicle) // add vehicle
router.get("/viewVehicles", verifyToken, vehicleController.getAllVehicles)  // view vehicle 
router.get("/viewvehicle/:id", verifyToken, vehicleController.viewVehicleById) // view vehicle by ID
router.put("/editvehicle/:id", verifyToken,  vehicleController.updateVehicle) // edit vehicle
router.delete("/deletevehicle/:id", verifyToken, vehicleController.deleteVehicle) // delete vehicle


// ROUTE
router.post('/addRoute',  mainRouteController.addRoute);
router.delete('/delRoute/:id',  mainRouteController.deleteRoute);    // Delete route by ObjectId
router.put('/updateRoute/:id',  mainRouteController.updateRoute);       // Update route by ObjectId
router.get('/getAllRoutes' , mainRouteController.getAllRoutes)        // View all routes
router.get('/getroute/:id',  mainRouteController.viewRouteById);     // View route by ObjectId


// subroute
router.post('/addSRoute',  subrouteController.addSubroute); // add subroute
router.put('/updateSRoute/:id',  subrouteController.editSubroute); // edit subroute
router.delete('/delSRoute/:id',  subrouteController.deleteSubroute); // delete subroute
router.get('/viewSRoute',  subrouteController.viewAllSubroutes); // view all subroutes
router.get('/viewSRoute/:id',  subrouteController.viewSubroute); // view subroute by ID

// MainRoute routes
// router.post("/main-route", verifyToken, mainRouteController.addRoute)
// router.get("/main-route", verifyToken, mainRouteController.getAllRoutes)
// router.get("/main-route/:id", verifyToken, mainRouteController.viewRouteById)
// router.put("/main-route/:id", verifyToken, mainRouteController.updateRoute)
// router.delete("/main-route/:id", verifyToken, mainRouteController.deleteRoute)

// SubRoute route to add a sub-route to a main route
// router.post("/main-route/:mainRouteId/sub-route", verifyToken, mainRouteController.addSubRoute)

//customer
router.post("/addcustomer", CustomerController.createCustomer) // add customer
router.get("/customer", verifyToken, CustomerController.getAllCustomers) // get all customers
router.put("/editcustomer/:id", verifyToken,CustomerController.updateCustomerById) // edit customer
router.get("/customer/:id", verifyToken, CustomerController.getCustomerById) // get customer by ID
router.delete("/customer/:id", verifyToken, CustomerController.deleteCustomerById) // delete customer

// Active Route
router.post("/activroutes", verifyToken, ActiveRouteController.createActiveRoute) // add active route
router.get("/getActiveRoutes", verifyToken, ActiveRouteController.getActiveRoutes) // get all active routes
router.get("/viewActiveRoute/:id", verifyToken, ActiveRouteController.viewActiveRouteById) // view active route by ID


//endride
router.post('/end-ride', verifyToken, EndRideController.endRide); // end ride
router.get('/getallendride', verifyToken, EndRideController.getEndRide); // get all end ride
 



//acoounts
router.post('/addaccounts', verifyToken, AccountsController.addAccount); // add account
router.get('/getallaccounts', verifyToken, AccountsController.getAllAccount); // get all accounts

// router.get('/get-one-account/:accountId', verifyToken,accountController.getOneAccount);

// router.put('/edit-account/:accountId', verifyToken,accountController.editAccount);

// router.delete('/delete-account/:accountId', verifyToken,accountController.deleteAccount);

// router.post('/auto-generate-account', verifyToken,accountController.autoGenerateAccount);



//Journal
router.post('/add-journal-entry', verifyToken,journalController.addJournalEntry); // add journal entry
router.get('/get-all-journal', verifyToken,journalController.getAllJournal); // get all journal entries
router.get('/get-one-journal/:id', verifyToken,journalController.getOneJournal); // get one journal entry by ID
router.get('/get-one-trial-balance/:accountId', verifyToken,AccountsController.getOneTrailBalance); // get one journal entry by ID


//Admin
router.post('/add-admin', verifyToken, AdminController.addAdmin); // add admin
router.post('/login', AdminController.login) // login admin



module.exports = router
