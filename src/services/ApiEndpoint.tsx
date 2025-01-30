export const endpoints = {
    //lofin
    LOGIN: `staff/login`,

    // For Active Route only 
    ADD_ACTIVE_ROUTE: `start-ride`,
    GET_ALL_STAFF: `getallstaffs`,
    GET_ALL_VEHICLES: `viewVehicles`,

    // End Ride
    END_Ride: `/complete-ride`,

    // Subroute
    GET_ALL_SUBROUTE: `viewSRoute`,
    VIEW_A_SUBROUTE: `viewSRoute`,

    // Customer
    ADD_CUSTOMER: `addcustomer`,
    GET_ALL_CUSTOMERS: `customer`,
    GET_A_CUSTOMER: `customer`,
    UPDATE_CUSTOMER: `editcustomer`,

    // Order
    ADD_ORDER: `orders`,
    GET_ALL_ORDER: `orders`,
    VIEW_A_ORDER: `orders`,
    RIDE_ORDERS: `today`,

    // Active routes
    GET_ALL_ACTIVE_ROUTE: `active-rides`,
    GET_AN_ACTIVE_ROUTE: `viewActiveRoute`,

    // Account
    GET_ALL_ACCOUNTS: `getallaccounts`,
}