export const endpoints= {

   // Login
  LOGIN: `login`,

  // vehicle
  GET_ALL_VEHICLES:`viewVehicles`,

  // staff
  GET_ALL_STAFF:`getallstaffs`,
  ADD_STAFF:`addstaff`,

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
  GET_A_MAINROUTE:`getroute/:id`
  

}
