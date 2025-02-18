export const endpoints = {

  // Login
  LOGIN: `login`,

  // vehicle
  GET_ALL_VEHICLES: `viewVehicles`,
  ADD_VEHICLE: `addVehicle`,
  EDIT_VEHICLE: `editvehicle`,
  DELETE_VEHICLE: `deletevehicle`,
  VIEW_AN_VEHICLE: `viewvehicle`,

  // staff
  GET_ALL_STAFF: `getallstaffs`,
  ADD_STAFF: `addstaff`,
  DELETE_AN_STAFF: `staff`,
  EDIT_STAFF: `staff`,
  GET_AN_STAFF: `staff`,

  // stock
  ADD_W_STOCK: `wstock`,
  GET_W_STOCK: `wstock`,
  ADD_STOCK_LOAD: `stock`,
  GET_ALL_LOADED_STOCK: `stock`,
  DELETE_STOCK_LOAD:`deletestock`,

  // internal transfer
  ADD_INTERNAL_TRANSFER: `internaltransfer`,
  GET_INTERNAL_TRANSFER: `getalltransfers`,
  DELETE_INTERNAL_TRANSFER:`internaltransfer`,

  // unloads
  ADD_UNLOAD_STOCK: `addunload`,
  GET_ALL_UNLOADS: `unload`,

  //item
  GET_ALL_ITEMS: `item`,
  ADD_AN_ITEM: `item`,
  GET_AN_ITEM: `getitem`,
  EDIT_AN_ITEM: `edititem`,
  DELETE_AN_ITEM: `item`,


  // warehouse
  GET_ALL_WAREHOUSE: `warehouse`,
  ADD_WAREHOUSE: `warehouse`,
  DELETE_WAREHOUSE: `warehouse`,
  GET_A_WAREHOUSE: `warehouse`,

  // Orders
  ADD_NEW_ORDER: `orders`,
  GET_ALL_ORDERS: `orders`,
  GET_AN_ORDER: `orders`,
  DELETE_AN_ORDER: `orders`,



  // Route
  ADD_MAINROUTE: `addRoute`,
  GET_ALL_MAINROUTE: `getAllroutes`,
  GET_A_MAINROUTE: `getroute`,
  DELETE_A_MAINROUTE: `delRoute`,
  UPDATE_A_MAINROUTE: `updateRoute`,


  //subroute
  ADD_SUBROUTE: `addSRoute`,
  GET_ALL_SUBROUTE: `viewSRoute`,
  DELETE_A_SUBROUTE: `delSRoute`,
  view_A_SUBROUTE: `viewSRoute`,
  UPDATE_A_SUBROUTE: `updateSRoute`,

  // Active routes

  GET_ALL_ACTIVE_ROUTE: `active-rides`,
  GET_AN_ACTIVE_ROUTE: `viewActiveRoute`,

  // Ride 
  GET_ALL_COMPLETED_RIDE: `completedride`,

  // ridehistory in main route
  GET_RIDE_HISTORY: `rides/completed`,




   //customers
   GET_ALL_CUSTOMERS: `customer`,
   DELETE_A_CUSTOMER: `customer`,
   GET_A_CUSTOMER: `customer`,
   ADD_CUSTOMER: `addcustomer`,
   UPDATE_CUSTOMER: `editcustomer`,
   GET_CUSTOMER_BY_SUBROUTE: `customerbysubroute`,
   GET_ALL_COUPON_CUSTOMER: `getcouponcustomers`,

  // ACCOUNTS
  ADD_NEW_ACCOUNT: `addaccounts`,
  GET_ALL_ACCOUNTS: `getallaccounts`,
  GET_ONE_TRIAL_BALANCE: `get-one-trial-balance`,
  EDIT_JOURNAL_ENTRY: `edit-journal-entry`,
  DELET_JOURNAL_ENTRY: `delete-journal`,

  ADD_NEW_JOURNEL_ENTRY: `add-journal-entry`,
  GET_ALL_JOURNALS: `get-all-journal`,
  GET_ONE_JOURNAL: `get-one-journal`,
  EDIT_NEW_ACCOUNT:`edit-account`,
  GET_ONE_ACCOUNT:`one-account`,
  DELETE_ACCONUT:`delete-account`,


  // receipt 
  GET_ALL_RECIEPT:`receipts`,
  ORDER_RECIEPT:`order-receipt`,
  VIEW_ONE_RECIEPT:`receipts`,
  EDIT_A_RECIEPT:`update-receipt`,
DELETE_RECEIPT:`deletereceipt`,

  // Coupons
  ADD_COUPON: `coupons`,
  GET_ALL_COUPON: `coupons`,
  VIEW_A_COUPON: `coupons`,
  EDIT_COUPON: `coupons`,
  DELETE_COUPON: `coupons`,

  // Supplier
  GET_ALL_SUPPLIERS: `supplier`,
  ADD_SUPPLIER: `supplier`,
  GET_A_SUPPLIER: `supplier`,
  EDIT_SUPPLIER: `supplier`,
  DELETE_SUPPLIER: `supplier`,

}

