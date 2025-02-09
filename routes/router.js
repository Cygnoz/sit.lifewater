
const express = require("express")
const router = express.Router()


const AccountsController = require('../controller/Accounts/accountController')
const journalController = require('../controller/Accounts/journalController');
// const ActiveRouteController = require("../controller/Route/ActiveRouteController")
const startRideController = require("../controller/Route/rideController")
const EndRideController = require('../controller/Route/EndRideController')
const mainRouteController = require("../controller/Route/MainRouteController")
const subrouteController = require('../controller/Route/SubRouteController');
const vehicleController = require("../controller/Route/VehicleController")

const AdminController = require('../controller/User/admin')
const CustomerController = require("../controller/User/CustomerController")
const staffController = require("../controller/User/staffController")
const couponController = require('../controller/Coupon/couponController')

const { verifyToken } = require('../middleware/auth');



router.post('/coupons', verifyToken,couponController.createCoupon);

// Route to get all coupons
router.get('/coupons', verifyToken,couponController.getCoupons);

// Route to get a specific coupon by ID
router.get('/coupons/:id', verifyToken,couponController.getCouponById);

// Route to update a coupon by ID
router.put('/coupons/:id', verifyToken,couponController.updateCoupon);

// Route to delete a coupon by ID
router.delete('/coupons/:id', verifyToken,couponController.deleteCoupon);



// STAFF
router.post("/staff/login", staffController.loginSalesStaff) // login staff(sales)

router.post("/addstaff", verifyToken, staffController.addStaff) // add staff
router.get("/getallstaffs",verifyToken, staffController.getAllStaff) // get all staff
router.get("/staff/:id", verifyToken, staffController.getStaffById) // get staff by ID
router.put("/staff/:id", verifyToken,  staffController.editStaff) // edit staff
router.delete("/staff/:id", verifyToken, staffController.deleteStaff) // delete staff


// VEHICLE
router.post("/addVehicle", verifyToken,  vehicleController.addVehicle) // add vehicle
router.get("/viewVehicles", verifyToken, vehicleController.getAllVehicles)  // view vehicle 
router.get("/viewvehicle/:id", verifyToken, vehicleController.viewVehicleById) // view vehicle by ID
router.put("/editvehicle/:id", verifyToken,  vehicleController.updateVehicle) // edit vehicle
router.delete("/deletevehicle/:id", verifyToken, vehicleController.deleteVehicle) // delete vehicle


// ROUTE
router.post('/addRoute',verifyToken,  mainRouteController.addRoute);
router.delete('/delRoute/:id',verifyToken,  mainRouteController.deleteRoute);    // Delete route by ObjectId
router.put('/updateRoute/:id',verifyToken,  mainRouteController.updateRoute);       // Update route by ObjectId
router.get('/getAllRoutes',verifyToken, mainRouteController.getAllRoutes)        // View all routes
router.get('/getroute/:id',verifyToken,  mainRouteController.viewRouteById);     // View route by ObjectId


// subroute
router.post('/addSRoute',verifyToken,  subrouteController.addSubroute); // add subroute
router.put('/updateSRoute/:id',verifyToken,  subrouteController.editSubroute); // edit subroute
router.delete('/delSRoute/:id',verifyToken,  subrouteController.deleteSubroute); // delete subroute
router.get('/viewSRoute',verifyToken,  subrouteController.viewAllSubroutes); // view all subroutes
router.get('/viewSRoute/:id',verifyToken,  subrouteController.viewSubroute); // view subroute by ID

// MainRoute routes
// router.post("/main-route", verifyToken, mainRouteController.addRoute)
// router.get("/main-route", verifyToken, mainRouteController.getAllRoutes)
// router.get("/main-route/:id", verifyToken, mainRouteController.viewRouteById)
// router.put("/main-route/:id", verifyToken, mainRouteController.updateRoute)
// router.delete("/main-route/:id", verifyToken, mainRouteController.deleteRoute)

// SubRoute route to add a sub-route to a main route
// router.post("/main-route/:mainRouteId/sub-route", verifyToken, mainRouteController.addSubRoute)

//customer
router.post("/addcustomer", verifyToken, CustomerController.createCustomer) // add customer
router.get("/customer", verifyToken, CustomerController.getAllCustomers) // get all customers
router.put("/editcustomer/:id", verifyToken, CustomerController.updateCustomerById) // edit customer
router.get("/customer/:id",  verifyToken, CustomerController.getCustomerById) // get customer by ID
router.get('/customerbysubroute/:subroute', verifyToken,CustomerController.getCustomersBySubroute);//get customer by subroute
router.delete("/customer/:id", verifyToken, CustomerController.deleteCustomerById) // delete customer
router.post('/coupon-customer',verifyToken, CustomerController.createCouponCustomer); // add coupon customer
router.get('/coupon-customer',verifyToken, CustomerController.getAllUniqueCouponCustomers); // get all coupon customer
router.get('/getcouponcustomers',verifyToken, CustomerController.getAllCouponCustomers)

// // Active Route
// router.post("/activroutes", verifyToken, ActiveRouteController.createActiveRoute) // add active route
// router.get("/getActiveRoutes", verifyToken, ActiveRouteController.getActiveRoutes) // get all active routes


//start ride
router.post('/start-ride', verifyToken, startRideController.startRide); // end ride
router.get('/active-rides',verifyToken, startRideController.getActiveRides)
router.get("/viewActiveRoute/:rideId", verifyToken, startRideController.viewSingleActiveRoute) // view active route by ID
router.put('/complete-ride', verifyToken, startRideController.completeRide)
router.get('/completedride', verifyToken, startRideController.getAllCompletedRides)
router.get('/active-rides/:salesmanId',startRideController.getActiveRidesBySalesmanId);

//endride
router.post('/end-ride', verifyToken, EndRideController.endRide); // end ride
router.get('/getallendride', verifyToken, EndRideController.getEndRide); // get all end ride

//mainroute ride history
router.get('/rides/completed/:mainRouteId', startRideController.getCompletedRidesByMainRoute);


//acoounts
router.post('/addaccounts', verifyToken, AccountsController.addAccount); // add account
router.get('/getallaccounts', verifyToken, AccountsController.getAllAccount); // get all accounts
router.put('/edit-account/:accountId',AccountsController.editAccount)
router.get('/one-account/:accountId',AccountsController.getOneAccount)
router.delete('/delete-account/:accountId',AccountsController.deleteAccount)


//addaccount
router.post('/add-autogenerateaccount', AccountsController.autoGenerateAccount); // add account

//Journal
router.post('/add-journal-entry', verifyToken,journalController.addJournalEntry); // add journal entry
router.get('/get-all-journal', verifyToken,journalController.getAllJournal); // get all journal entries
router.get('/get-one-journal/:id', verifyToken,journalController.getOneJournal); // get one journal entry by ID
router.get('/get-one-trial-balance/:accountId', verifyToken,AccountsController.getOneTrailBalance); // get one journal entry by ID
router.put('/edit-journal-entry/:id', verifyToken,journalController.updateJournalEntry); // get one journal entry by ID



//Admin
router.post('/login', AdminController.login) // login admin

router.post('/add-admin', AdminController.addAdmin); // add admin



module.exports = router
