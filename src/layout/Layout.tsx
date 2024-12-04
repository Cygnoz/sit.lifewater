import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SubHeader from './SubHeader';
import CreateOrder from '../pages/Createorder';
import ViewOrder from '../components/ViewOrder';
import NewOrder from '../pages/NewOrder';
import ActiveRoute from '../Route/Pages/Activeroute';
import SubRoute from '../Route/Pages/SubRoute';
import EditSubRoute from '../Route/Pages/EditSubRoute';
import CreateSubRoute from '../Route/Components/CreateSubRoute';
import CreateRoute from '../Route/Pages/Createroute';
import CreateMainRoute from '../Route/Components/CreateMainRoute';
import ViewRoute from '../Route/Components/ViewRoute';
import AddVehicle from '../Vehicle/Components/AddVehicle';
import CreateVehicle from '../Vehicle/Pages/CreateVehicle';
import EditVehicles from '../Vehicle/Pages/EditVehicles';
import ViewVehicle from '../Vehicle/Components/ViewVehicle';
import StaffOverview from '../components/Staffoverview';
import AddCustomer from '../Customer/Components/AddCustomer';
import EditCustomer from '../Customer/Pages/EditCustomer';
import ViewCustmor from '../Customer/Components/ViewCustmor';
import Ride from '../Ride/Pages/Ride';
import CreateInternalTransfer from '../Stock/Internal transfer/Pages/CreateInternalTransfer';
import AddItem from '../Stock/Items/Components/AddItem';
import CreateItem from '../Stock/Items/Pages/CreateItem';
import EditItem from '../Stock/Items/Pages/EditItem';
import StockLoaded from '../Modules/Stock/StockLoaded/Stock_loaded';
import UnloadedAdd from '../Stock/Unload stock/Pages/UnloadAdd';
import AddWStock from '../Stock/W stock/Components/AddWStock';
import CreateWStock from '../Stock/W stock/Pages/CreateWstock';
import EditMainRoute from '../Route/Pages/EditMainRoute';
import BalanceSheet from '../Reportss/Pages/Balancesheet';
import CashSale from '../Reportss/Pages/Cashsale';
import CouponSale from '../Reportss/Pages/Couponsale';
import CreditSale from '../Reportss/Pages/Creditsale';
import DayBook from '../Reportss/Pages/DayBook';
import ProfitLoss from '../Reportss/Pages/Profit&loss';
import ReturnStock from '../Reportss/Pages/ReturnStock';
import StockSold from '../Reportss/Pages/StockSold';
import TotalSale from '../Reportss/Pages/TotalSale';
import TrailBalance from '../Reportss/Pages/Trailbalance';
// import AddNewVendors from '../Purchase/Components/AddNewVendors';
// import AddPaymentReceipt from '../Purchase/Components/AddPaymentReceipt';
// import AddPurchase from '../Purchase/Components/AddPurchase';
// import AddPurchaseOrder from '../Purchase/Components/AddPurchaseOrder';
// import CreatePaymentReceipts from '../Purchase/Pages/CreatePaymentReceipts';
// import Purchase from '../Purchase/Pages/Purchase';
// import PurchaseOrder from '../Purchase/Pages/PurchaseOrder';
// import Suppliers from '../Purchase/Pages/Suppliers';
import AddCollection from '../Sales/Components/AddCollection';
import AddCoupon from '../Sales/Components/AddCoupon';
import AddCreditNote from '../Sales/Components/AddCreditNote';
import AddReceipt from '../Sales/Components/AddReceipt';
import Bottles from '../Sales/Pages/Bottles';
import Coupon from '../Sales/Pages/Coupon';
import CreditNotes from '../Sales/Pages/CreditNotes';
import EditCoupon from '../Sales/Pages/EditCoupon';
import Invoice from '../Sales/Pages/Invoice';
import Receipt from '../Sales/Pages/Receipt';
import Salesman from '../Sales/Pages/Salesman';
import AddStockloaded from '../Stock/Stock loaded/Components/AddStockloaded';
import AddInternalStock from '../Stock/Internal transfer/Components/AddInternalStock';
import AddUnloadStock from '../Stock/Unload stock/Components/AddUnloadStock';
import AddWarehouse from '../Stock/Warehouse/Components/AddWarehouse';
import CreateWarehouse from '../Stock/Warehouse/Pages/CreateWarehouse';
import ViewActiveRoute from '../Route/Components/ViewActiveRoute';
import ViewSubRoute from '../Route/Components/ViewSubRoute';
import MyComponent from '../dashboard/pages/DashBoard';
import CreateProfile from '../Settings/Pages/CreateProfile';
import ChartOfAccounts from '../Accounts/Pages/ChartOfAccount';
import AccountantViewUI from '../Accounts/accountantview/AccountantView';
import NewJournal from '../Accounts/manualJournal/newJournal/Newjournal';
import ManualHome from '../Accounts/manualJournal/ManualHome';
import ManualView from '../Accounts/manualJournal/ManualView';
import CustomerHome from '../Modules/Customer/CustomerHome.tsx/CustomerHome';
import Login from '../Settings/Login/Login';
import CreateStaff from '../Staff/Createstaff';
import AddStaff from '../Staff/AddStaff';

const App: React.FC = () => {
  const [selectedNav, setSelectedNav] = useState<string>(() => localStorage.getItem('selectedNav') || '');
  const [subhead, setSubhead] = useState<{ headName: string; subRoute: string }[]>(() => {
    const savedSubhead = localStorage.getItem('subhead');
    return savedSubhead ? JSON.parse(savedSubhead) : [];
  });
  const location = useLocation();

  const handleNavSelect = (nav: string, subhead: { headName: string; subRoute: string }[]) => {
    setSelectedNav(nav);
    setSubhead(subhead);
    localStorage.setItem('selectedNav', nav); // Save to localStorage
    localStorage.setItem('subhead', JSON.stringify(subhead)); // Save to localStorage
  };
  useEffect(() => {
    // Check if the route matches any subhead on component mount
    const currentRoute = location.pathname;
    const matchedNav = JSON.parse(localStorage.getItem('subhead') || '[]').find(
      (item: { subRoute: string }) => item.subRoute === currentRoute
    );
    if (matchedNav) {
      setSelectedNav(localStorage.getItem('selectedNav') || '');
      setSubhead(JSON.parse(localStorage.getItem('subhead') || '[]'));
    }
  }, [location]);
  const isLoginPage = location.pathname === '/';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    );
  }
  
  return (
    <>
      <div className="flex h-[1200px] bg-[#f6f6f6]">
        <Sidebar onSelect={handleNavSelect} className="w-1/4" />
        <div className="flex-1 p-4">
          <Header />
          <SubHeader selectedNav={selectedNav} subhead={subhead} />
          <div className='h-screen bg-[#f6f6f6]'>
            <Routes>
              <Route path='/dashboard' element={<MyComponent />} />
              
              {/* ORDERS */}
              <Route path='/orders' element={<CreateOrder />} />
              <Route path='/addneworder' element={<NewOrder />} />
              <Route path='/vieworder/:id' element={<ViewOrder />} />

              {/* STAFF */}
              <Route path='/staff' element={<CreateStaff />} />
              <Route path='/addstaff' element={<AddStaff />} />
              <Route path='/editstaff/:id' element={<AddStaff />} />
              <Route path="/viewstaff/:id" element={<StaffOverview />} />

              {/* ROUTE */}
              <Route path='/route/createroute' element={<CreateRoute />} />
              <Route path='/route/createmainroute' element={<CreateMainRoute />} />
              <Route path='/route/viewroute/:id' element={<ViewRoute />} />
              <Route path='/route/activeroute' element={<ActiveRoute />} />
              <Route path='/route/editmainroute/:id' element={<EditMainRoute/>} />
              <Route path='/route/subroute' element={<SubRoute />} />
              <Route path='/route/newsubroute' element={<CreateSubRoute />} />
              <Route path='/route/editsubroute/:id' element={<EditSubRoute />} />
              <Route path='/route/viewactiveroute/:id' element={<ViewActiveRoute />} />
              <Route path='/route/viewsubroute/:id' element={<ViewSubRoute />} />

              {/* VEHICLE */}
              <Route path='/vehicle' element={<CreateVehicle />} />
              <Route path='/vehicle/addvehicle' element={<AddVehicle />} />
              <Route path='/vehicle/editvehicle/:id' element={<EditVehicles />} />
              <Route path='/viewvehicle/:id' element={<ViewVehicle />} />

              {/* CUSTOMER */}
              <Route path='/customer' element={<CustomerHome/>}/>
              <Route path='/editcustomer/:id' element={<EditCustomer/>}/>
              <Route path='/addcustomer' element={<AddCustomer/>}/>
              <Route path='/viewcustomer/:id' element={<ViewCustmor/>}/>

              {/* RIDE */}
              <Route path='/ride' element={<Ride/>}/>

              {/* STOCK */}
              {/* INTERNAL TRANSFER */}
              <Route path='/internaltransfer' element={<CreateInternalTransfer/>}/>
              <Route path='/addinternaltransfer' element={<AddInternalStock/>}/>

              {/* ITEMS */}
              <Route path='/additem' element={<AddItem/>}/>
              <Route path='/item' element={<CreateItem/>}/>
              <Route path='/edititem/:id' element={<EditItem/>}/>

              {/* STOCK LOADED */}
              <Route path='/stockloaded' element={<StockLoaded/>}/>
              <Route path='/addstockloaded' element={<AddStockloaded/>}/>

              {/* UNLOAD STOCK */}
              <Route path='/unloadstock' element={<UnloadedAdd/>}/>
              <Route path='/addunloadstock' element={<AddUnloadStock/>}/>

              {/* WAREHOSUE STOCK */}
              <Route path='/addWstock' element={<AddWStock/>}/>
              <Route path='/warstock' element={<CreateWStock/>}/>
              <Route path='/addwarehouse' element={<AddWarehouse/>}/>
              <Route path='/warehouse' element={<CreateWarehouse/>}/>

              {/* REPORTS */}
              <Route path='/balancesheet' element={<BalanceSheet/>}/>
              <Route path='/cashsale' element={<CashSale/>}/>
              <Route path='/couponsale' element={<CouponSale/>}/>
              <Route path='/creditsale' element={<CreditSale/>}/>
              <Route path='/daybook' element={<DayBook/>}/>
              <Route path='/profit-lose' element={<ProfitLoss/>}/>
              <Route path='/returnstock' element={<ReturnStock/>}/>
              <Route path='/stocksold' element={<StockSold/>}/>
              <Route path='/totalsale' element={<TotalSale/>}/>
              <Route path='/trailbalance' element={<TrailBalance/>}/>

              {/* PURCHASE */}

              {/* <Route path='/addvendors' element={<AddNewVendors/>}/>
              <Route path='/addpaymentreciept' element={<AddPaymentReceipt/>}/>
              <Route path='/addpurchase' element={<AddPurchase/>}/>
              <Route path='/addpurchaseorder' element={<AddPurchaseOrder/>}/>
              <Route path='/paymentreciept' element={<CreatePaymentReceipts/>}/>
              <Route path='/purchase' element={<Purchase/>}/>
              <Route path='/purchaseorder' element={<PurchaseOrder/>}/>
              <Route path='/suppliers' element={<Suppliers/>}/> */}

              {/* SALES */}
              <Route path='/addcollection' element={<AddCollection/>}/>
              <Route path='/addcoupon' element={<AddCoupon/>}/>
              <Route path='/addcreditnote' element={<AddCreditNote/>}/>
              <Route path='/addreciept' element={<AddReceipt/>}/>
              <Route path='/bottles' element={<Bottles/>}/>
              <Route path='/coupon' element={<Coupon/>}/>
              <Route path='/editcoupon' element={<EditCoupon/>}/>
              <Route path='/creditnote' element={<CreditNotes/>}/>
              <Route path='/invoice' element={<Invoice/>}/>
              <Route path='/reciept' element={<Receipt/>}/>
              <Route path='/salesman' element={<Salesman/>}/>

              {/* ACCOUNTS */}
              <Route path='/journals' element={<ManualHome/>}/>
              <Route path='/newjournal' element={<NewJournal/>}/>
              <Route path='/viewjournal/:id' element={<ManualView/>}/>
              <Route path='/chartofaccount' element={<ChartOfAccounts/>}/>
              <Route path='/accountant/view/:id' element={<AccountantViewUI/>}/>

              {/* SETTINGS */}
              <Route path='/settings' element={<CreateProfile/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

