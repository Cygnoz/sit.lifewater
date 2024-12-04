export const endpoints= {

   // Login
  LOGIN: `login`,

  // vehicle
  GET_ALL_VEHICLES:`viewVehicles`,

  // staff
  GET_ALL_STAFF:`getallstaffs`,
  ADD_STAFF:`addstaff`,
  DELETE_AN_STAFF:`staff`,
  EDIT_STAFF:`staff`,
  GET_AN_STAFF:`staff`,

  // stock
  ADD_W_STOCK:`wstock`,
  GET_W_STOCK:`wstock`,

  //item
  GET_ALL_ITEMS:`item`,
  ADD_AN_ITEM:`item`,
  GET_AN_ITEM:`getitem`,
  EDIT_AN_ITEM:`edititem`,
  DELETE_AN_ITEM:`item`,


  // warehouse
 GET_ALL_WAREHOUSE: `warehouse`,
 ADD_WAREHOUSE: `warehouse`,
 DELETE_WAREHOUSE:`warehouse`,


  // Route
  ADD_MAINROUTE:`addRoute`,
  GET_ALL_MAINROUTE:`getAllroutes`,
  GET_A_MAINROUTE:`getroute/:id`,





  //customers
  GET_ALL_CUSTOMERS:`customer`,
  DELETE_A_CUSTOMER:`customer`,
  GET_A_CUSTOMER:`customer`,
  
// ACCOUNTS
ADD_NEW_ACCOUNT:`addaccounts`,
GET_ALL_ACCOUNTS:`getallaccounts`,
GET_ONE_TRIAL_BALANCE:`get-one-trial-balance`,

ADD_NEW_JOURNEL_ENTRY:`add-journal-entry`,
GET_ALL_JOURNALS:`get-all-journal`,
GET_ONE_JOURNAL:`get-one-journal`
}
