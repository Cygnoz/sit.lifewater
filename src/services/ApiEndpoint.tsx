export const endpoints = {
    //login
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
    GET_CUSTOMER_BY_SUBROUTE :`customerbysubroute`,

    // Order
    ADD_ORDER: `orders`,
    GET_ALL_ORDER: `orders`,
    VIEW_A_ORDER: `orders`,
    RIDE_ORDERS: `today`,
    ORDER_RECIEPT:`order-receipt`,
    GET_ALL_RECIEPT:`receipts`,
    EDIT_ORDER : `editorder`,
    DELETE_AN_ORDER:`orders`,
    // Active routes
    GET_ALL_ACTIVE_ROUTE: `active-rides`,
    GET_AN_ACTIVE_ROUTE: `viewActiveRoute`,
    GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID: `active-rides`,

    // Account
    GET_ALL_ACCOUNTS: `getallaccounts`,

    //Coupon
    GET_ALL_COUPON:`coupons`,
    ADD_COUPON_CUSTOMER:`coupon-customer`,
}