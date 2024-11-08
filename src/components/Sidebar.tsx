import React, { useEffect, useState } from "react";
import home from "../assets/images/home.svg";
import orders from "../assets/images/orders.svg";
import stock from "../assets/images/stock.svg";
import summary from "../assets/images/summary.svg";
import ret from "../assets/images/Vector.png";
import users from "../assets/images/users.svg";
import close from "../assets/images/x-mark.svg";
import bars from "../assets/images/bars-4.svg";
import coup from "../assets/images/coup.svg";
import credit from "../assets/images/credit.svg";
import pay from "../assets/images/pay.svg";
import endride from "../assets/images/endride.svg";
import hstory from "../assets/images/history.svg";
import rout from "../assets/images/rout.svg";

import { BASEURL } from "../services/BaseURL";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Typography } from "@mui/material";

interface SidebarProps {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  handleToggleSidebar,
}) => {
  const [pagetitle, setPageTitle] = useState(""); // State to store the current title
  const navigate = useNavigate();
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [storedProfile, setStoredProfile] = useState<string | null>(null);

  // Retrieve username from session storage on component load
  useEffect(() => {
    const savedUsername = localStorage.getItem("firstname");
    const storedProfile = localStorage.getItem("profile");
    if (savedUsername && storedProfile) {
      console.log(savedUsername , storedProfile);
      setStoredUsername(savedUsername);
      setStoredProfile(storedProfile)
    }
  }, []);

  
  const handleNavigation = (path: string, pagetitle: string) => {
    setPageTitle(pagetitle); // Update the page title based on the clicked sidebar item
    navigate(path);
    handleToggleSidebar();
  };
console.log(storedProfile);

const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleLogout =()=>{
    localStorage.clear()
    navigate('/')
  }
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[60px] bg-white shadow-lg z-50 flex items-center justify-between p-4">
        {/* Toggle Button (for small screens) */}
        {!isSidebarOpen && (
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden z-50"
            style={{ position: "relative" }}
          >
            <img className="w-6 h-6" src={bars} alt="Toggle Sidebar" />
          </button>
        )}
        <h1 className="font-bold">{pagetitle}</h1>{" "}
        {/* Display the current title */}
        <div className="w-25 flex gap-2 pt-2">
          {pagetitle === "End Ride" || pagetitle === "Customers" || pagetitle === "Orders"? (
            <div className="">
              <p className="text-[#000000] text-[14px] font-[700]">
                Hello,
                {storedUsername ? (
                 <span> {storedUsername}</span>
                ) : (
                  <span>User</span>
                )}
              </p>
              <p className="text-sm">Welcome</p>
            </div>
          ) : null}
         {storedProfile ? (
    <img 
    onClick={handleOpen}
      className="object-cover w-11 h-11 rounded-full" 
      src={`${BASEURL}/uploads/${storedProfile}`} 
      alt="Profile"
    />
  ) : (
    <img 
      className="object-cover w-11 h-11 rounded-full" 
      src="path/to/default-image.jpg" 
      alt="Default Profile"
    />
  )}
        </div>
      </div>
      

      {/* Sidebar for larger screens */}
      <div
        className={`fixed left-0 h-screen bg-white mt-10 transition-width duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-x-hidden z-40`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl mt-5 font-bold">Menu</h1>
          <button onClick={handleToggleSidebar}>
            <img
              className="w-6 h-6 bg-[#d8b0b0] rounded-[27px] mt-5"
              src={close}
              alt="Close Sidebar"
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 ml-2">
          <ul>
            <li
              onClick={() => handleNavigation("/home", "Home")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={home} alt="Home" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Home
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/orders", "Orders")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={orders} alt="Orders" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Orders
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/customers", "Customers")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={users} alt="Customers" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Customers
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/stock", "Stock")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={stock} alt="Stock" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Stock
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/summary", "Summary")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={summary} alt="Summary" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Summary
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/return", "Return")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img
                src={ret}
                alt="Return"
                className="hover:text-white w-6 h-6"
              />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Return
              </span>
            </li>
            <li
              onClick={() =>
                handleNavigation("/collection", "Payment Collection")
              }
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={pay} alt="Payment" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Payment Collection
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/credit", "Credit Issued")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={credit} alt="Credit" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Credit Issued
              </span>
            </li>
            <li
              onClick={() =>
                handleNavigation("/couponcustomer", "Coupon Customers")
              }
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={coup} alt="Coupon" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Coupon Customers
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/route", "Route")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={rout} alt="Route" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Route
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/visithistory", "Visit History")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={hstory} alt="History" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                Visit History
              </span>
            </li>
            <li
              onClick={() => handleNavigation("/endride", "End Ride")}
              className="flex items-center p-2 gap-4 mb-1 hover:text-white hover:bg-gradient-to-r from-[#820000] to-[#2c353b] rounded-2xl"
            >
              <img src={endride} alt="End Ride" className="w-6 h-6" />
              <span
                className={`${isSidebarOpen ? "inline-block ml-3" : "hidden"}`}
              >
                End Ride
              </span>
            </li>
          </ul>
        </nav>
      </div>

 
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           Do you want to logout ?
          </Typography>
          <div className="flex gap-4 justify-center mt-5">
          <button onClick={handleClose} className="px-6 py-3 bg-gray-500 text-white rounded-lg">Cancel</button>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-800 text-white rounded-lg">Logout</button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Sidebar;
