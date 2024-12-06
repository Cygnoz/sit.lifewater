import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Typography } from "@mui/material";
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
import profile from "../assets/images/profile.jpg";
import Button from "../CommonComponents/Button";

// Sidebar menu items
const menuItems = [
  { title: "Home", icon: home, path: "/home" },
  { title: "Orders", icon: orders, path: "/orders" },
  { title: "Customers", icon: users, path: "/customers" },
  { title: "Stock", icon: stock, path: "/stock" },
  { title: "Summary", icon: summary, path: "/summary" },
  { title: "Return", icon: ret, path: "/return" },
  { title: "Payment Collection", icon: pay, path: "/collection" },
  { title: "Credit Issued", icon: credit, path: "/creditcollection" },
  { title: "Coupon Customers", icon: coup, path: "/couponcustomer" },
  { title: "Route", icon: rout, path: "/route" },
  { title: "Visit History", icon: hstory, path: "/visithistory" },
  { title: "End Ride", icon: endride, path: "/endride" },
];

const Sidebar: React.FC<{ isSidebarOpen: boolean; handleToggleSidebar: () => void }> = ({
  isSidebarOpen,
  handleToggleSidebar,
}) => {
  const navigate = useNavigate();
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [pagetitle, setPageTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(""); // State for active item
  const sidebarRef = useRef<HTMLDivElement | null>(null); // Ref for sidebar

  // Close sidebar on outside click
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (sidebarRef.current && isSidebarOpen && !sidebarRef.current.contains(event.target as Node)) {
        handleToggleSidebar(); // Close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isSidebarOpen, handleToggleSidebar]);

  // Fetch localStorage data on mount
  useEffect(() => {
    setStoredUsername(localStorage.getItem("userName"));
  }, []);

  const handleNavigation = (path: string, title: string) => {
    setActiveItem(title); // Set active item
    setPageTitle(title);
    navigate(path);
    handleToggleSidebar();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full h-[60px] bg-white shadow-lg z-50 flex items-center justify-between p-4">
        {/* Toggle Button */}
        {!isSidebarOpen && (
          <button onClick={handleToggleSidebar} className="lg:hidden z-50">
            <img src={bars} alt="Toggle Sidebar" className="w-6 h-6" />
          </button>
        )}
        <h1 className="font-bold">{pagetitle || "Dashboard"}</h1>
        <div className="flex items-center gap-4">
          <div>
            {pagetitle === "Home" && (
              <div>
                <p className="text-sm font-semibold">
                  Hello, {storedUsername || "User"}
                </p>
                <p className="text-xs">Welcome</p>
              </div>
            )}
          </div>
          <img
            src={profile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach ref to sidebar
        className={`fixed left-0 h-screen bg-white shadow-lg transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 z-40`}
      >
        <div className="p-4 flex justify-between">
          <h2 className="text-xl font-bold">Menu</h2>
          {isSidebarOpen && (
            <button onClick={handleToggleSidebar}>
              <img src={close} alt="Close Sidebar" className="w-6 h-6" />
            </button>
          )}
        </div>
        <ul className="mt-4">
          {menuItems.map(({ title, icon, path }) => (
            <li
              key={title}
              onClick={() => handleNavigation(path, title)}
              className={`flex items-center p-3 gap-3 cursor-pointer 
                ${activeItem === title ? "bg-gradient-to-l from-[#820000] to-[#2C353B] rounded-2xl text-white font-semibold" : "hover:bg-gray-200"}`}
            >
              <img
                src={icon}
                alt={title}
                className={`w-6 h-6 ${activeItem === title ? "rounded-lg p-0.5 bg-white" : ""}`}
              />
              <span>{title}</span>
            </li>
          ))}
          <li >
            <div className="mx-[5%] my-2">
              <Button size="xl" variant="primary" onClick={() => setOpen(true)}>
                Logout
              </Button>
            </div>
          </li>
        </ul>
      </div>

      {/* Logout Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="p-6 bg-white rounded-md shadow-lg">
          <Typography variant="h6">Do you want to log out?</Typography>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="fourthiary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Sidebar;
