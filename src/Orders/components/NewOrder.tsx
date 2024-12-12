// import React, { useState, ChangeEvent, useEffect, useRef, useContext } from "react";
// import trash from "../../assets/images/trash.svg";
// import circleplus from "../../assets/images/Icon.svg";
// import printer from "../../assets/images/printer.svg";
// import back from "../../assets/images/backbutton.svg";
// import { Link, useNavigate } from "react-router-dom";
// // import cimage from '../assets/images/Ellipse 43.svg'
// import icondown from "../../assets/images/Icon down.svg";
// import search from "../../assets/images/search.svg";
// import { BASEURL } from "../../services/Baseurl";
// import { getItemsAPI } from "../../services/StockAPI/StockAPI";
// import downarrow from "../../assets/images/Vector.png";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { endpoints } from "../../services/ApiEndpoint";
// import useApi from "../../Hook/UseApi";
// import { WarehouseResponseContext } from "../../Context/ContextShare";

// interface Item {
//   itemId: string;
//   itemName: string;
//   quantity: number;
//   // status?: string; // Optional, if needed
// }


// interface OrderDetails {
 
//   orderNumber: string;
//   mainRouteName: string;
//   mainRouteId: string;
//   subRouteName: string;
//   subRouteId: string;
//   customer: string;
//   customerId: string;
//   salesman: string;
//   warehouse: string;
//   date: string;
//   paymentMode: string;
//   totalAmount: number;
//   stock: Item[];
//   notes: string;
//   termsAndCondition: string;
// }


// const NewOrder: React.FC = () => {
//   const [orderDetails, setOrderDetails] = useState<OrderDetails>({

//     orderNumber: "",
//     mainRouteName: "",
//     mainRouteId: "",
//     subRouteName: "",
//     subRouteId: "",
//     customerId: "",
//     salesman: "",
//     date: "", // Reset date to an empty string
//     paymentMode: "",
//     notes: "",
//     termsAndCondition: "",
//     totalAmount: 0, // Reset totalAmount to 0
//     stock: [ // Use `items` instead of `stock`
//       {
//         itemId: "", // Reset itemId to an empty string
//         itemName: "",
//         quantity: 0,
//       },
//     ],
//   });
  
//   console.log(orderDetails);

//   const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
//   const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
//   const [searchValue, setSearchValue] = useState<string>("");

//   const [rows, setRows] = useState<Item[]>([
//     {itemId:"", itemName: "", quantity: 0,},
//   ]);

 



//   const handleRowChange = (index: number, field: keyof Item, value: string) => {
//     const newRows = [...rows];
//     newRows[index] = {
//       ...newRows[index],
//       [field]: value,
//     };
//     const quantity = Number(newRows[index].quantity) || 1;
    

//     setRows(newRows);
//     setOrderDetails({ ...orderDetails, stock: newRows });
//   };

//   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearchValue(e.target.value);
//   };


//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       dropdownRef.current &&
//       !dropdownRef.current.contains(event.target as Node)
//     ) {
//       setOpenDropdownType(null); // Close whichever dropdown is open
//     }
//   };

//   useEffect(() => {
//     if (openDropdownType !== null) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [openDropdownType]);

//   interface Customer {
//     companyName: string;
//     fullName: string;
//     logo: string;
//     mobileNo: string;
//     _id:string
//   }

//   const defaultImage =
//     "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png";
//   // Function to remove duplicates based on a unique field (like mobileNo or _id)
//   const removeDuplicates = (array: Customer[]) => {
//     const seen = new Set();
//     return array.filter((customer) => {
//       const duplicate = seen.has(customer.mobileNo); // Use a unique identifier here
//       seen.add(customer.mobileNo);
//       return !duplicate;
//     });
//   };
//   // get customer
//   const [customers, setCustomers] = useState<any[]>([]); // State for customer data
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
//     null
//   );
//   const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");

//   // Filter customers based on search term
//   const filteredCustomers = customers.filter((customer) =>
//     `${customer.fullName} ${customer.companyName}`
//       .toLowerCase()
//       .includes(customerSearchTerm.toLowerCase())
//   );

//   // Step 3: Update the search term
//   const handleCustomerSearchChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setCustomerSearchTerm(e.target.value);
//   };
//   // Customer selection function
//   const handleCustomerSelection = (customer: Customer) => {
//     setSelectedCustomer(customer);
//     setOrderDetails(
//       { ...orderDetails, 
//         customer: `${customer.fullName}` ,
//         customerId: customer._id
//     });
//     setOpenDropdownType(null); // Close dropdown on selection
//   };
//   // Fetch customers on component mount
//   const { request: getAllCustomers } = useApi("get", 4000);
//   const getALLCustomers = async () => {
//     try {
//       const url = `${endpoints.GET_ALL_CUSTOMERS}`;
//       const { response, error } = await getAllCustomers(url);
//       console.log("Cust API RESPONSE :", response);

//       if (!error && response) {
//         setLoading(false);
//         setCustomers(response.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getALLCustomers();
//   }, []);

//   const toggleCustomerDropdown = () => {
//     setOpenDropdownType(openDropdownType === "customer" ? null : "customer");
//   };

//   interface Staff {
//     firstname: string;
//     lastname: string;
//     designation: string;
//     profile: string; // Add other fields as per your staff object structure
//   }

//   const [salesmanSearchTerm, setSalesmanSearchTerm] = useState<string>("");
//   const [staffList, setStaffList] = useState<Staff[]>([]);
//   const [filteredStaffList, setFilteredStaffList] = useState<Staff[]>([]);
//   const [selectedSalesman, setSelectedSalesman] = useState<Staff | null>(null);
//   const { request: getAllStaffData } = useApi("get", 4000);
//   // Fetch staff data on component mount
//   useEffect(() => {
//     const fetchStaff = async () => {
//       try {
//         const url = `${endpoints.GET_ALL_STAFF}`;
//         const { response, error } = await getAllStaffData(url);
//         if (!error && response) {
//           setStaffList(response.data);
//           console.log(response.data, "staff");
//         } else {
//           console.log(error);
//         }
//       } catch (error) {
//         console.error("Error fetching staff data:", error);
//       }
//     };

//     fetchStaff();
//   }, []);

//   // Filter Salesman based on search term
//   useEffect(() => {
//     const filteredList = staffList.filter((staff) =>
//       `${staff.firstname} ${staff.lastname}`
//         .toLowerCase()
//         .includes(salesmanSearchTerm.toLowerCase())
//     );
//     setFilteredStaffList(filteredList);
//   }, [salesmanSearchTerm, staffList]);

//   // Handle Salesman Search Change
//   const handleSalesmanSearchChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setSalesmanSearchTerm(e.target.value);
//   };

//   const handleSalesmanSelection = (salesman: Staff) => {
//     setSelectedSalesman(salesman);
//     setOrderDetails({
//       ...orderDetails,
//       salesman: `${salesman.firstname} ${salesman.lastname}`,
//     });
//     setOpenDropdownType(null); // Close dropdown on selection
//   };

//   const toggleSalesmanDropdown = () => {
//     setOpenDropdownType(openDropdownType === "salesman" ? null : "salesman");
//   };

//   const [items, setItems] = useState<any[]>([]); // State to store fetched items
//   const [loading, setLoading] = useState(true); // State to manage loading state

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const data = await getItemsAPI();
//         setItems(data);
//       } catch (error) {
//         console.error("Error fetching items:", (error as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItems();
//   }, []);
//   console.log(items, "items");

//   // select warehouse
//   interface WarehouseItem {
//     _id: string;
//     warehouseName: string;
//   }
//     const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  
//     // warehouses
//     const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem | null>(null)
//     // Handle warehouse selection
//     const handleWarehouseChange = (event : any) => {
//       const warehouseId = event.target.value;
//       // Find the selected warehouse object
//       const selectedWarehouse = warehouses.find((w) => w._id === warehouseId);
//       const warehouseName = selectedWarehouse ? selectedWarehouse.warehouseName : "";
//       setSelectedWarehouse(selectedWarehouse || null);
//       // Update the orderDetails with the selected warehouseName and warehouseId
//       setOrderDetails((prev) => ({
//         ...prev,
//         warehouseId,   // Store the warehouse ID
//         warehouseName, // Store the warehouse name
//       }));
//     };
    
  
  
//     const filteredItems = selectedWarehouse ? selectedWarehouse.stock : [];
  
    
  
//     const { setWarehouseResponse } = useContext(WarehouseResponseContext)!;
//     const { request: getWarehouseData } = useApi("get", 4001);
  
//     const getAllWarehouse = async () => {
//       try {
//         const url = `${endpoints.GET_ALL_WAREHOUSE}`;
//         const { response, error } = await getWarehouseData(url);
//         if (!error && response) {
//           setWarehouses(response.data.warehouses);
//           console.log(response.data.warehouses, "warehouse");
//           setWarehouseResponse(response.data.warehouses);
//         } else {
//           console.log(error);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     useEffect(() => {
//       getAllWarehouse();
//     }, []);
  
//     const handleItemSelect = (selectedItem: any, index: number) => {
//       setOrderDetails((prev) => {
//         const updatedStock = [...prev.stock];
//         updatedStock[index] = {
//           ...updatedStock[index],
//           itemId: selectedItem.itemId, // Set itemId
//           itemName: selectedItem.itemName, // Set itemName
//           quantity: selectedItem.quantity, // Set quantity
//         };
//         return { ...prev, stock: updatedStock };
//       });
//       setOpenDropdownId(null); // Close the dropdown
//     };
    
    
  
//     const updateOrder = (
//       e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//       const { name, value } = e.target;
    
//       setOrderDetails((prev) => ({
//         ...prev,
//         [name]: value, // Dynamically updating the orderDetails based on the field name
//       }));
//     };
    
    
  
//     const handleItemChange = (
//       index: number,
//       field: keyof Item,
//       value: string
//     ) => {
//       setOrderDetails((prev) => {
//         const newItems = [...prev.stock];
//         newItems[index] = {
//           ...newItems[index],
//           [field]: value,
//         };
    
//         // If the field is 'quantity', convert to a number
//         if (field === "quantity") {
//           newItems[index].quantity = Number(value) || 0;
//         }
    
//         return { ...prev, stock: newItems };
//       });
//     };
    
//     const removeItem = (index: number) => {
//       setOrderDetails((prev) => ({
//         ...prev,
//         stock:
//           prev.stock.length > 1
//             ? prev.stock.filter((_, i) => i !== index)
//             : [{ itemId: "", itemName: "", quantity: 0 }], // Keep only itemId, itemName, and quantity
//       }));
//     };
    
  
//     const addItem = () => {
//       setOrderDetails((prev) => ({
//         ...prev,
//         stock: [
//           ...prev.stock,
//           { itemId: "", itemName: "", quantity: 0 }, // Add a blank row with itemId, itemName, and quantity
//         ],
//       }));
//     };
    
    
  
//     const toggleDropdown = (index: number, type: string) => {
//       setOpenDropdownId(index === openDropdownId ? null : index);
//       setOpenDropdownType(type);
//     };


  

//   // const [loading, setLoading] = useState(false);
//   const { request: AddnewOrder } = useApi("post", 4001);
//   const navigate = useNavigate();
  
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true); // Set loading to true before making the request
  
//     try {
//       const url = `${endpoints.ADD_NEW_ORDER}`;
//       const { response, error } = await AddnewOrder(url, orderDetails);
  
//       if (error) {
//         // If there's an error, handle it gracefully
//         console.error("Error:", error);
//         toast.error(error?.response?.data?.message || "An error occurred.");
//         return; // Stop further execution if there's an error
//       }
  
//       if (response && response.data) {
//         console.log("Stock:", response);
//         toast.success(response.data.message);
//         setTimeout(() => {
//           navigate('/stockloaded');
//         }, 1000);
//       } else {
//         toast.error("Failed to add order: " + (response?.message || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       toast.error("An error occurred while submitting the order.");
//     } finally {
//       setLoading(false); // Reset loading state after request is complete
//     }
//   };
  


//   // const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"
//   return (
//     <>
//       {/* <div className='flex bg-gray-50 '> */}

//       <form onSubmit={handleSubmit}>
//         <div className=" flex max-h-screen ">
//           <ToastContainer
//             position="top-center"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={true}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="colored"
//           />

//           {/* Main content */}
//           <div className="flex-1 min-h-screen">
//             <div className="flex gap-1 items-center w-full max-w-8xl ms-1 mt-1">
//               <Link to="/orders">
//                 <img
//                   className="bg-gray-200 rounded-full p-1"
//                   src={back}
//                   alt="Back"
//                 />
//               </Link>
//               <h3 className="text-[20px] text-[#303F58] font-bold ms-1">
//                 New order
//               </h3>
//             </div>
//             <div className="container mx-auto p-3">
//               <div className="bg-white p-2 -mt-2 -ms-2 rounded-lg shadow-md">
//                 {/* Customer and Salesman Selection */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   {/* Customer Selection */}
//                   <div className="mb-2">
//                     <label className="block mb-2 font-normal text-[#303F58] text-[14px]">
//                       Customer
//                     </label>
//                     <div
//                       className="relative w-full"
//                       onClick={toggleCustomerDropdown}
//                     >
//                       <div className="items-center flex appearance-none w-full h-9  bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
//                         <span className="font-normal">
//                           {selectedCustomer
//                             ? `${selectedCustomer.fullName} `
//                             : "Select Customer"}
//                         </span>
//                       </div>
//                       <img
//                         className="ms-[435px] -mt-6 w-[11px] h-[11px] text-[#495160]"
//                         src={icondown}
//                         alt=""
//                       />
//                     </div>

//                     {openDropdownType === "customer" && (
//                       <div
//                         ref={dropdownRef}
//                         className="absolute z-10 bg-white rounded-md mt-1 p-2 w-[326px] space-y-1"
//                       >
//                         {/* Search input for customers */}
//                         <div className="grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
//                           <input
//                             className="pl-9 text-sm w-full rounded-md text-start text-[#818894] h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
//                             placeholder="Search Customer"
//                             value={customerSearchTerm}
//                             onChange={handleCustomerSearchChange}
//                           />
//                           <img
//                             className="ms-3 -mt-12 w-[15px] h-[15px]"
//                             src={search}
//                             alt=""
//                           />
//                         </div>

//                         {/* Filtered customer list */}
//                         {filteredCustomers.map((customer) => (
//                           <div
//                             key={customer.mobileNo} // Make sure to use a unique key
//                             onClick={() => handleCustomerSelection(customer)}
//                             className="grid grid-cols-12 gap-1 p-2 bg-[#FDF8F0] cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
//                           >
//                             <div className="col-span-2 flex items-center justify-center">
//                               <img
//                                 src={
//                                   customer.logo
//                                     ? `${BASEURL}/uploads/${customer.logo}`
//                                     : defaultImage
//                                 }
//                                 alt={`${customer.fullName}`}
//                               />
//                             </div>
//                             <div className="col-span-10 flex">
//                               <div>
//                                 <p className="font-semibold text-[14px] text-[#0B1320]">
//                                   {" "}
//                                   {customer.fullName}
//                                 </p>
//                                 <p className="text-[12px] font-normal text-[#495160]">
//                                   Phone: {customer.workPhone}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}

//                         {/* Add new customer option */}
//                         <Link to="/addcustomer">
//                           <div className="bg-white h-12 flex justify-center items-center cursor-pointer border border-slate-400 rounded-lg">
//                             <div className="flex justify-center items-center">
//                               <img className="" src={circleplus} alt="" />{" "}
//                               &nbsp; &nbsp;
//                               <span className="text-[#820000]">
//                                 Add New Customer
//                               </span>
//                             </div>
//                           </div>
//                         </Link>
//                       </div>
//                     )}
//                   </div>

//                   {/* Salesman Selection */}
//                   <div>
//                     <label className="block mb-2 font-normal text-[#303F58] text-[14px]">
//                       Salesman
//                     </label>
//                     <div
//                       className="relative w-full"
//                       onClick={toggleSalesmanDropdown}
//                     >
//                       <div className="items-center flex appearance-none w-full h-9  bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
//                         <span className="font-normal">
//                           {selectedSalesman
//                             ? `${selectedSalesman.firstname} ${selectedSalesman.lastname}`
//                             : "Select Salesman"}
//                         </span>
//                       </div>
//                       <img
//                         className="ms-[435px] -mt-6 w-[11px] h-[11px] text-[#495160]"
//                         src={icondown}
//                         alt=""
//                       />
//                     </div>

//                     {openDropdownType === "salesman" && (
//                       <div
//                         ref={dropdownRef}
//                         className="absolute z-10 bg-white rounded-md mt-1 p-2 w-[326px] h-auto space-y-1"
//                       >
//                         {/* Search input */}
//                         <div className="grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
//                           <input
//                             className="pl-9 text-sm w-full rounded-md text-start text-[#818894] h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
//                             placeholder="Search Salesman"
//                             value={salesmanSearchTerm}
//                             onChange={handleSalesmanSearchChange}
//                           />
//                           <img
//                             className="ms-3 -mt-12 w-[15px] h-[15px]"
//                             src={search}
//                             alt=""
//                           />
//                         </div>

//                         {/* Filtered salesman list */}
//                         {filteredStaffList.map((staff, index) => (
//                           <div
//                             key={index}
//                             onClick={() => handleSalesmanSelection(staff)}
//                             className="grid grid-cols-12 gap-1 p-2 bg-[#FDF8F0] cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
//                           >
//                             <div className="col-span-2 flex items-center justify-center">
//                               <img
//                                 src={
//                                   staff.profile
//                                     ? `${staff.profile}`
//                                     : defaultImage
//                                 }
//                                 alt={`${staff.firstname} ${staff.lastname}`}
//                               />
//                             </div>
//                             <div className="col-span-10 flex">
//                               <div>
//                                 <p className="font-semibold text-[14px] text-[#0B1320]">
//                                   {staff.firstname} {staff.lastname}
//                                 </p>
//                                 <p className="text-[12px] font-normal text-[#495160]">
//                                   Designation: {staff.designation}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}

//                         <Link to="/addstaff">
//                           <div className="bg-white h-12 flex justify-center items-center cursor-pointer border border-slate-400 rounded-lg">
//                             <div className="flex justify-center items-center">
//                               <img className="" src={circleplus} alt="" />{" "}
//                               &nbsp; &nbsp;
//                               <span className="text-[#820000]">
//                                 Add New Salesman
//                               </span>
//                             </div>
//                           </div>
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Warehouse selection */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
//                       Warehouse
//                     </label>
//                     <select onChange={handleWarehouseChange} className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal">
//                           <option value="">Select Warehouse</option>
//                           {warehouses.map((warehouse) => (
//                             <option key={warehouse._id} value={warehouse._id}>
//                               {warehouse.warehouseName}
//                             </option>
//                           ))}
//                         </select>

//                   </div>
//                   <div>
//                     <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={orderDetails.date}
//                       onChange={updateOrder}
//                       className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
//                       Order Number
//                     </label>
//                     <input
//                       type="number"
//                       name="orderNumber"
//                       value={orderDetails.orderNumber}
//                       onChange={updateOrder}
//                       className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
//                       placeholder=""
//                     />
//                   </div>
//                 </div>

//                 {/* Payment Mode Dropdown */}
//                 <div className="mb-4">
//                   <label className="block mb-2 font-normal text-[#303F58] text-[14px]">
//                     Payment Mode
//                   </label>
//                   <select
//                     name="paymentMode"
//                     value={orderDetails.paymentMode}
//                     onChange={updateOrder}
//                     className="w-full p-2 border rounded-md text-[14px] font-normal"
//                   >
//                     <option value="" className="font-normal">
//                       Select payment mode
//                     </option>
//                     <option value="Cash" className="text-gray-800 font-normal">
//                       Cash
//                     </option>
//                     <option
//                       value="Credit"
//                       className="text-gray-800 font-normal"
//                     >
//                       Credit
//                     </option>
//                     <option value="FOC" className="text-gray-800 font-normal">
//                       FOC
//                     </option>
//                     {/* Add more payment options as needed */}
//                   </select>
//                 </div>

//                 {/* Add Item Section */}
//               {/* Add Item Section */}
//               <div className="rounded-lg border-2 border-tableBorder mt-5">
//                   <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
//                     <thead className="text-[12px] text-center bg-[#FDF8F0] text-dropdownText">
//                       <tr className="bg-lightPink">
//                         {[
//                           "Product",
//                           "Quantity",
                         
//                           "Actions",
//                         ].map((item, index) => (
//                           <th
//                             key={index}
//                             className="py-2 px-4 font-medium border-b border-tableBorder relative"
//                           >
//                             {item}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="text-dropdownText text-center text-[13px]">
//                       {orderDetails.stock.map((item, index) => (
//                         <tr key={index}>
//                           <td className="border-y py-3 px-2 border-tableBorder">
//                             <div
//                               className="relative w-full"
//                               onClick={() =>
//                                 toggleDropdown(index, "searchProduct")
//                               }
//                             >
//                           {item.itemName ? (
//                                   <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">                             
//                                     <div className="col-span-8 text-start">
//                                       <p className="text-textColor">{item.itemName}</p>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <div
//                                     className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm gap-2"
//                                     onClick={() => toggleDropdown(index, "searchProduct")} // Show dropdown when clicked
//                                   >
//                                     <p>Type or click</p>
//                                     <p>
//                                       <img src={downarrow} alt="" width={12} />
//                                     </p>
//                                   </div>
//                                 )}

//                             </div>
//                             {openDropdownId === index &&
//                               openDropdownType === "searchProduct" && (
//                                 <div
//                                   ref={dropdownRef}
//                                   className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[40%] space-y-1"
//                                 >
//                                   <input
//                                     type="text"
//                                     value={searchValue}
//                                     onChange={(e) =>
//                                       setSearchValue(e.target.value)
//                                     }
//                                     placeholder="Select Item"
//                                     className="w-full p-2 border rounded-lg h-12 bg-[#F9F7F5]"
//                                   />
                                  
//                                   {filteredItems.length > 0 ? (
//                                       filteredItems.map((item: any, idx: number) => (
//                                         <div
//                                           key={idx}
//                                           onClick={() => handleItemSelect(item, idx)} // Handle item selection
//                                           className="grid bg-[#FDF8F0] grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg"
//                                         >
//                                           <div className="col-span-10 flex">
//                                             <div className="text-start">
//                                               <p className="font-bold text-sm text-black">{item.itemName}</p>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))
//                                     ) : (
//                                       <div className="text-center border-slate-400 border rounded-lg">
//                                         <p className="text-red-500 text-sm py-4">Items Not Found!</p>
//                                       </div>
//                                     )}

                                  
//                                   <Link to="/additem">
//                                     <button className="bg-darkGreen text-[#820000] mt-1 rounded-lg py-4 px-6 flex items-center text-sm font-bold border-slate-400 border gap-2 w-full hover:bg-lightRed">
//                                       <img src={circleplus} alt="" />{" "}
//                                       <p>Add New Item</p>
//                                     </button>
//                                   </Link>
//                                 </div>
//                               )}
//                           </td>
//                           <td className="py-2.5 px-4 border-y border-tableBorder">
//                             <input
//                               type="number"
//                               value={item.quantity}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   index,
//                                   "quantity",
//                                   e.target.value
//                                 )
//                               }
//                               className="text-center w-20"
//                               placeholder="0"
//                             />
//                           </td>
                         
//                           <td className="py-2.5 px-4 border-y border-tableBorder text-center">
//                             <button
//                               onClick={() => removeItem(index)}
//                               className="text-red-500 px-2 py-1"
//                             >
//                               <img src={trash} alt="" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <button
//                   className="flex items-center text-[#820000] text-md font-bold gap-2 mx-1 my-4"
//                   onClick={addItem}
//                 >
//                   <img src={circleplus} alt="" /> <p>Add Item</p>
//                 </button>

//                 <br />
//                 <br />

//                 {/* Notes and Terms */}
//                 {/* <div className="mb-4 -mt-10">
//                     <label className="block mb-2 font-normal">Add Notes</label>
//                     <textarea
//                       name="notes"
//                       value={orderDetails.notes}
//                       onChange={updateOrder}
//                       className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
//                       placeholder='Add a Note'
//                     ></textarea>
//                   </div>
  
//                   <div className="mb-4 -mt-3">
//                     <label className="block mb-1 font-normal">Terms & Conditions</label>
//                     <textarea
//                       name="terms"
//                       value={orderDetails.terms}
//                       onChange={updateOrder}
//                       className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
//                       placeholder='Add Terms and Condition of Your Business'
//                     ></textarea>
//                   </div> */}

//                 {/* <div className='flex justify-end mt-5'>
//                 <div>
//                   <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
//                     Cancel
//                   </button>
  
//                 </div> */}
//                 {/* <div>
//                   <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
//                     <img src={printer} className='me-1 mt-1 -ms-2' alt="" />
//                     Print
//                   </button>
//                 </div> */}
//                 {/* <div>
//                   <button className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]">
//                     Save
//                   </button>
//                 </div>
  
//               </div> */}
//               </div>
//             </div>
//           </div>
//           {/* </div> */}

//           <div className="flex w-[30%] h-[370px] p-6 rounded-lg shadow-md mt-10 bg-white">
//             <div className="justify-center">
//               {/* <div className='flex my-2'>
//                 <h3 className='text-[#4B5C79] text-[14px] font-normal'>Untaxed Amount</h3>
//                 <h1 className='text-[#303F58] text-[18px] font-bold ms-40'>Rs 0.00</h1>
//               </div>
//               <div className='flex my-1'>
//                 <h3 className='text-[#4B5C79] text-[14px] font-normal'>SGST</h3>
//                 <h1 className='text-[#4B5C79] text-[14px] font-normal ms-64'>Rs 0.00</h1>
//               </div>
//               <div className='flex my-1'>
//                 <h3 className='text-[#4B5C79] text-[14px] font-normal'>CGST</h3>
//                 <h1 className='text-[#4B5C79] text-[14px] font-normal ms-64'>Rs 0.00</h1>
//               </div> */}
//               <div className="mb-4">
//                 <label className="block mb-2 font-normal">Add Notes</label>
//                 <textarea
//                   name="notes"
//                   value={orderDetails.notes}
//                   onChange={updateOrder}
//                   className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
//                   placeholder="Add a Note"
//                 ></textarea>
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-1 font-normal">
//                   Terms & Conditions
//                 </label>
//                 <textarea
//                   name="termsAndCondition"
//                   value={orderDetails.termsAndCondition}
//                   onChange={updateOrder}
//                   className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
//                   placeholder="Add Terms and Condition of Your Business"
//                 ></textarea>
//               </div>
//               <hr className="my-4 text-[#CCCCCC] text-[10px] font-bold" />

//               <div className="flex my-1 justify-between">
//                 <h3 className="text-[#0B1320] text-[16px] font-bold">Total</h3>
//                 <h1 className="text-[#303F58] text-[18px] font-bold"></h1>
//               </div>

//               <div className="flex ms-24 mt-5">
//                 <div>
//                   <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
//                     Cancel
//                   </button>
//                 </div>
//                 <div>
//                   <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
//                     <img src={printer} className="me-1 mt-1 -ms-2" alt="" />
//                     Print
//                   </button>
//                 </div>
//                 <div>
//                   <button
//                     type="submit"
//                     className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default NewOrder;
