import './App.css';
import Sidebar from './components/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Customers from './pages/Customers';
import Returncustomer from './pages/Returncustomer';
import { useState } from 'react';
import Visithistory from './pages/VisitHistory';
import Summary from './pages/Summary';
import PaymentCollection from './pages/PaymentCollection';
import Addreturncustomer from './components/Addreturncustomer';
import Stock from './pages/Stock';
import Couponsale from './components/CouponSale';
import CouponCustomer from './pages/CouponCustomer';
import CreditCollection from './components/CreditCollection';
import Login from './login/Login';
import StartRide from './pages/StartRide';
import AddStartRide from './components/AddStartRide';
import AddCustomer from './components/AddCustomer';
import ViewCustomers from './pages/ViewCustomers';
import EndRide from './pages/EndRide';
import Dashboard from './pages/Dashboard';
import Maps from './pages/Map';
import EditCustomer from './pages/EditCustomer';
// import Routed from './pages/Route';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation(); // Get the current path

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Conditionally render the Sidebar if not on the login page */}
      {location.pathname !== '/' && location.pathname !== '/start' && location.pathname !== '/addstart' && (
        <Sidebar isSidebarOpen={isSidebarOpen} handleToggleSidebar={handleToggleSidebar} />
      )}

      {/* Conditionally apply margin-top if not on login page */}
      <div className={`flex-grow ${location.pathname !== '/' && location.pathname !== '/start' && location.pathname !== '/addstart' ? 'mt-[60px]' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/start" element={<StartRide />} />
          <Route path="/addstart" element={<AddStartRide />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/addcustomers" element={<AddCustomer />} />
          <Route path="/viewcustomers" element={<ViewCustomers/>} />
          <Route path="/editcustomer/:id" element={<EditCustomer/>} />
          <Route path="/return" element={<Returncustomer />} />
          <Route path="/visithistory" element={<Visithistory />} />
          <Route path="/addpayment" element={<Addreturncustomer />} />
          <Route path="/collection" element={<PaymentCollection />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/couponsale" element={<Couponsale />} />
          <Route path="/couponcustomer" element={<CouponCustomer />} />
          <Route path="/creditcollection" element={<CreditCollection />} />
          <Route path="/endride" element={<EndRide />} />
          <Route path="/route" element={<Maps />} />
        
        </Routes>
      </div>
    </div>
  );
}

export default App;
