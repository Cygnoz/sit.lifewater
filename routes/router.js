
const express = require("express")
const router = express.Router()


const staffController = require("../controller/User/staffController")
const vehicleController = require("../controller/Route/VehicleController")
const mainRouteController = require("../controller/Route/RouteController")
const subrouteController = require('../controller/Route/SubRouteController');
const CustomerController = require("../controller/User/CustomerController")
const journalController = require('../controller/Accounts/manualJournal');
const ActiveRouteController = require("../controller/Route/ActiveRouteController")
const EndRideController = require('../controller/Route/EndRideController')
const AccountsController = require('../controller/Accounts/accountController')
const AdminController = require('../controller/User/admin')

const { verifyToken } = require('../middleware/auth');



// STAFF
// Add staff
router.post("/addstaff", verifyToken, staffController.addStaff)

// Get all staff
router.get("/getallstaffs", verifyToken, staffController.getAllStaff)

// Get staff by ID
router.get("/staff/:id", verifyToken, staffController.getStaffById)

// Edit staff
router.put("/staff/:id", verifyToken,  staffController.editStaff)

// Delete staff
router.delete("/staff/:id", verifyToken, staffController.deleteStaff)

//login staff(sales)
router.post("/staff/login", verifyToken, staffController.loginSalesStaff)





// VEHICLE
// Add vehicle
router.post("/addVehicle", verifyToken,  vehicleController.addVehicle)

// view vehicle
router.get("/viewVehicles", verifyToken, vehicleController.getAllVehicles)

// view single vehicle
router.get("/viewvehicle/:id", verifyToken, vehicleController.viewVehicleById)

// edit vehicle
router.put("/editvehicle/:id", verifyToken,  vehicleController.updateVehicle)

// delete vehicle
router.delete("/deletevehicle/:id", verifyToken, vehicleController.deleteVehicle)


// ROUTE
// Route endpoints
router.post('/addRoute', verifyToken, mainRouteController.addRoute);
router.delete('/delRoute/:id', verifyToken, mainRouteController.deleteRoute);    // Delete route by ObjectId
router.put('/updateRoute/:id', verifyToken, mainRouteController.updateRoute);       // Update route by ObjectId
router.get('/getAllRoutes' , verifyToken,mainRouteController.getAllRoutes)        // View all routes
router.get('/getroute/:id', verifyToken, mainRouteController.viewRouteById);     // View route by ObjectId

// subroute
router.post('/addSRoute', verifyToken, subrouteController.addSubroute);
router.put('/updateSRoute/:id', verifyToken, subrouteController.editSubroute);
router.delete('/delSRoute/:id', verifyToken, subrouteController.deleteSubroute);
router.get('/viewSRoute', verifyToken, subrouteController.viewAllSubroutes);
router.get('/viewSRoute/:id', verifyToken, subrouteController.viewSubroute);
router.get('/getSRoute/:id', verifyToken, subrouteController.getSubroutebyID);

// MainRoute routes
// router.post("/main-route", verifyToken, mainRouteController.addRoute)
// router.get("/main-route", verifyToken, mainRouteController.getAllRoutes)
// router.get("/main-route/:id", verifyToken, mainRouteController.viewRouteById)
// router.put("/main-route/:id", verifyToken, mainRouteController.updateRoute)
// router.delete("/main-route/:id", verifyToken, mainRouteController.deleteRoute)

// SubRoute route to add a sub-route to a main route
// router.post("/main-route/:mainRouteId/sub-route", verifyToken, mainRouteController.addSubRoute)

//customer
router.post("/addcustomer", verifyToken, CustomerController.createCustomer)
router.get("/customer", verifyToken, CustomerController.getAllCustomers)
// router.post('/addsalesmancustomer', verifyToken,CustomerController.addCustomerFromSalesman);
router.put("/editcustomer/:id", verifyToken,CustomerController.updateCustomerById)
// router.put('/editcustomer/:id', verifyToken,CustomerController.editCustomerFromSalesman);
router.get("/customer/:id", verifyToken, CustomerController.getCustomerById)
router.delete("/customer/:id", verifyToken, CustomerController.deleteCustomerById)

// Active Route
router.post("/activroutes", verifyToken, ActiveRouteController.createActiveRoute)
router.get("/getActiveRoutes", verifyToken, ActiveRouteController.getActiveRoutes)
router.get("/viewActiveRoute/:id", verifyToken, ActiveRouteController.viewActiveRouteById)


//endride
router.post('/end-ride', verifyToken, EndRideController.endRide);
router.get('/getallendride', verifyToken, EndRideController.getEndRide);




//acoounts
router.post('/addaccounts', verifyToken, AccountsController.addAccount);
router.get('/getallaccounts', verifyToken, AccountsController.getAllAccount);

// router.get('/get-one-account/:accountId', verifyToken,accountController.getOneAccount);

// router.put('/edit-account/:accountId', verifyToken,accountController.editAccount);

// router.delete('/delete-account/:accountId', verifyToken,accountController.deleteAccount);

// router.post('/auto-generate-account', verifyToken,accountController.autoGenerateAccount);



//Journal

router.post('/add-journal-entry', verifyToken,journalController.addJournalEntry);

router.get('/get-all-journal', verifyToken,journalController.getAllJournal);

router.get('/get-one-journal/:id', verifyToken,journalController.getOneJournal);

router.get('/get-one-trial-balance/:accountId', verifyToken,AccountsController.getOneTrailBalance)




//Admin

router.post('/add-admin', verifyToken, AdminController.addAdmin);

router.post('/login', AdminController.login)



module.exports = router
