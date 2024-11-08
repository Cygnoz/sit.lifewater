import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import trash from '../../../assets/images/trash.svg';
import circleplus from '../../../assets/images/Icon.svg';
import printer from '../../../assets/images/printer.svg';
import back from '../../../assets/images/backbutton.svg';
import { Link, useNavigate } from 'react-router-dom';
import { getItemsAPI } from '../../../services/StockAPI/StockAPI';
import downarrow from '../../../assets/images/Vector.png';
import { getRoutesAPI } from '../../../services/RouteAPI/RouteAPI';
import { getWarehouseAPI } from '../../../services/WarehouseAPI/WarehouseAPI';
import { addUnloadAPI } from '../../../services/StockAPI/UnloadAPI';
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Route {
  id: string;
  _id: string;
  mainRoute: string;
  subrouteCode: string;
  subRoute: string;
  description: string;
}

interface Item {
  product: string;
  quantity: number;
  rate: number;
  
  amount: number;
}

interface UnloadDetails {
  mainRoute: string;
  warehouseName: string;
  date: string;
  transferNumber: string;
  items: Item[];
  autoNotes: string;
  termsAndConditions: string;
}

const initialOrderDetails = {
  mainRoute: '',
  warehouseName: '',
  date: '',
  transferNumber: '',
  items: [], // Assuming items is an array
  autoNotes: '',
  termsAndConditions: '',
};

const AddUnloadStock: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<UnloadDetails>({
    mainRoute: '',
    warehouseName: '',
    date: '',
    transferNumber: '',
    items: [{ product: '', quantity: 0, rate: 0, amount: 0}],
    autoNotes: '',
    termsAndConditions: '',
  });

  // Function to get the ObjectId of the product by its name
// Function to get the ObjectId of the product by its name
const getProductIdByName = async (productName: string) => {
  try {
    const response = await getItemsAPI(); // Fetch the list of items

    // Check if the response is defined and is an array
    if (response && Array.isArray(response)) {
      const item = response.find((item: any) => item.itemName === productName); // Update to match the response structure
      return item ? item._id : null; // Return the ObjectId if found
    } else {
      console.error('Unexpected response structure:', response);
      return null; // Handle unexpected response structure
    }
  } catch (error) {
    console.error('Error fetching product ID:', error);
    return null;
  }
};

const navigate = useNavigate();

const handleAddUnload = async () => {
  // Format items to include all required fields by the API
  const formattedItems = await Promise.all(
    orderDetails.items.map(async (item) => {
      const productId = await getProductIdByName(item.product);
      if (!productId) {
        throw new Error(`Product not found: ${item.product}`);
      }
      return {
        _id: productId,
        product: item.product,
        quantity: item.quantity,
        rate: parseFloat(item.rate.toString()), // Convert rate back to number
        amount: parseFloat(item.amount.toString()) // Convert amount back to number
      };
    })
  );

  const unloadData: UnloadDetails = {
    mainRoute: orderDetails.mainRoute,
    warehouseName: orderDetails.warehouseName,
    date: new Date(orderDetails.date).toISOString(),
    transferNumber: orderDetails.transferNumber,
    items: formattedItems, // Include the formatted items
    autoNotes: orderDetails.autoNotes,
    termsAndConditions: orderDetails.termsAndConditions,
  };

  console.log('Unload Data:', unloadData); // For debugging

  try {
    const response = await addUnloadAPI(unloadData);
    console.log(response);

    if (response?.status === 201) { // Use strict equality
      toast.success("Stock unloaded successfully");
      setOrderDetails(initialOrderDetails); // Resetting to initial state

      setTimeout(() => {
        navigate('/unloadstock');
      }, 2000); 
      
    } else {
      toast.error("Stock unload failed");
      console.log('Failed to add unload:', response);
    }
  } catch (error) {
    console.error('Error while adding unload:', error);
    toast.error("Stock unload failed");
  }
};










  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const [rows, setRows] = useState<Item[]>([
    { product: "", quantity: 0, rate: 0, amount: 0 },
  ]);


  const addRow = () => {
    setRows([...rows, { product: "", quantity: 0, rate: 0, amount: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    } else {
      setRows([{ product: "", quantity: 0, rate: 0, amount: 0 }]);
    }
  };

  const handleItemSelect = (item: any, index: number) => {
    const newRows = [...rows];

    const quantity = Number(item.quantity) || 1;
    const rate = Number(item.purchasePrice) || 0;

    newRows[index] = {
      product: item.
      itemName,
      quantity: quantity,
      rate: rate,
      amount: (rate * quantity),
    };

    setRows(newRows);
    setOrderDetails({ ...orderDetails, items: newRows });
    setOpenDropdownId(null);
    setOpenDropdownType(null);
  };

  const handleRowChange = (index: number, field: keyof Item, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: value,
    };
    const quantity = Number(newRows[index].quantity) || 1;
    const rate = Number(newRows[index].rate) || 0;
    newRows[index].amount = (rate * quantity);

    setRows(newRows);
    setOrderDetails({ ...orderDetails, items: newRows });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };


  const toggleDropdown = (index: number, type: string) => {
    setOpenDropdownId(index === openDropdownId ? null : index);
    setOpenDropdownType(type);
  };

  const filteredItems = () => items.filter(item => item.itemName.toLowerCase().includes(searchValue.toLowerCase()));



  // Update order details
  const updateOrder = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);


  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdownType(null); // Close whichever dropdown is open
    }
  };

  useEffect(() => {
    if (openDropdownType !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownType]);





  const [items, setItems] = useState<any[]>([]); // State to store fetched items
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItemsAPI();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };


    fetchItems();
  }, []);
  console.log(items,'items');


//fetch mainroute
const [routesList, setRouteList] = useState<Route[]>([]); // Full route list
const [selectedRoute, setSelectedRoute] = useState(''); // Selected route

useEffect(() => {
  const fetchRoutes = async () => {
    try {
      const response = await getRoutesAPI();
      setRouteList(response); // Set fetched routes
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  fetchRoutes();
}, []);

const handleRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedMainRoute = event.target.value;
  
  // Update both the selected route and orderDetails
  setSelectedRoute(selectedMainRoute);
  setOrderDetails((prevOrderDetails) => ({
    ...prevOrderDetails,
    mainRoute: selectedMainRoute,
  }));
};

//get warehouse

interface WarehouseItem {
  _id: string;
  warehouseName: string;
  contactNo: string;
  address: string;
}

const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

useEffect(() => {
  const fetchWarehouse = async () => {
    try {
      const response = await getWarehouseAPI();
      setWarehouses(response.warehouses);
      console.log('Warehouses set:', response); // Verify the data
      
    } catch (error: any) {
      console.error('Failed to fetch warehouses:', error);
    }
  };
  fetchWarehouse();
}, []);

const handleWarehouseSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedWarehouseId = e.target.value;
  
  // Find the selected warehouse object based on the selected ID
  const selectedWarehouse = warehouses.find((warehouse) => warehouse._id === selectedWarehouseId);
  
  // Set both the selected warehouse and update orderDetails with warehouseName
  setSelectedWarehouse(selectedWarehouseId);
  setOrderDetails((prevOrderDetails) => ({
    ...prevOrderDetails,
    warehouseName: selectedWarehouse ? selectedWarehouse.warehouseName : '',
  }));
};




  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"
  return (
    <>
      {/* <div className='flex bg-gray-50 '> */}

        <div className=" flex max-h-screen ">


          {/* Main content */}
          <div className="flex-1 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

            <div className="flex gap-1 items-center w-full max-w-8xl ms-1 mt-1">
              <Link to="/unloadstock">
                <img className="bg-gray-200 rounded-full p-1" src={back} alt="Back" />
              </Link>
              <h3 className="text-[20px] text-[#303F58] font-bold ms-1">Add Unload</h3>
            </div>
            <div className="container mx-auto p-3">
              <div className="bg-white p-2 -mt-2 -ms-2 rounded-lg shadow-md">
                {/* main route selection and Warehouse Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* main route selection */}
                  <div>
    <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
      Main Route
    </label>
    <select
      name="mainRoute"
      value={selectedRoute}
      onChange={handleRouteChange}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="" disabled>Select main route</option>
      {routesList.map((route) => (
        <option key={route._id} value={route.mainRoute}>
          {route.mainRoute}
        </option>
      ))}
    </select>
  </div>


    <div>
    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">
      Warehouse
    </label>
    <select
      name="warehouse"
      value={selectedWarehouse}
      onChange={handleWarehouseSelection}
      className="w-full p-2 border rounded-md text-[14px] font-normal"
    >
      <option value="" className="font-normal text-[#8F99A9]">Select Warehouse</option>
      {warehouses.map((warehouse) => (
        <option key={warehouse._id} value={warehouse._id} className="font-normal">
          {warehouse.warehouseName}
        </option>
      ))}
    </select>
  </div>


                </div>


                {/* Date and Order Number */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={orderDetails.date}
                      onChange={updateOrder}
                      className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
                    />
                  </div>
                  <div>
                   <label className="block mb-2 font-medium text-[#303F58] text-[14px]">Transfer Number</label>
                   <input
                     type="number"
                     name="date"
                    placeholder=''
                     className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px]"
                   />
                 </div>
                </div>



                {/* Add Item Section */}
                <div className="rounded-lg border-2 border-tableBorder mt-5">
                  <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
                    <thead className="text-[12px] text-center bg-[#FDF8F0] text-dropdownText">
                      <tr className="bg-lightPink">
                        {["Product", "Quantity", "Rate", "Amount", "Actions"].map((item, index) => (
                          <th key={index} className="py-2 px-4 font-medium border-b border-tableBorder relative">
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-dropdownText text-center text-[13px]">
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td className="border-y py-3 px-2 border-tableBorder">
                            <div className="relative w-full" onClick={() => toggleDropdown(index, "searchProduct")}>
                              {row.product ? (
                                <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <div className="flex items-start col-span-4">
                                    <img className="rounded-full h-10 w-10" src={defaultImage} alt="" />
                                  </div>
                                  <div className="col-span-8 text-start">
                                    <p className="text-textColor">{row.product}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <p>Type or click</p>&nbsp;&nbsp;
                                  <p><img src={downarrow} alt="" width={12}/></p>
                                </div>
                              )}
                            </div>
                            {openDropdownId === index && openDropdownType === "searchProduct" && (
                              <div ref={dropdownRef} className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[40%] space-y-1">
                                <input
                                  type="text"
                                  value={searchValue}
                                  onChange={handleSearchChange}
                                  placeholder="Select Item"
                                  className="w-full p-2 border rounded-lg h-12  bg-[#F9F7F5]"
                                />
                                {loading ? (
                                  <p>Loading...</p>
                                ) : filteredItems().length > 0 ? (
                                  filteredItems().map((item, idx) => (
                                    <div key={idx} onClick={() => handleItemSelect(item, index)} className="grid bg-[#FDF8F0] grid-cols-12 gap-1 p-2
                                     hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink">
                                      <div className="col-span-2 flex justify-center">
                                        <img className="rounded-full h-10" src={item.itemImage || defaultImage} alt="" />
                                      </div>
                                      <div className="col-span-10 flex">
                                        <div className="text-start">
                                          <p className="font-bold text-sm text-black">{item.itemName}</p>
                                          <p className="text-xs text-gray-500">Rate: RS.{item.purchasePrice}</p>
                                        </div>
                                        <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">&times;</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center border-slate-400 border rounded-lg">
                                    <p className="text-[red] text-sm py-4">Items Not Found!</p>
                                  </div>
                                )}
                                <Link to="/additem">
                                  <button className="bg-darkGreen text-[#820000] mt-1 rounded-lg py-4 px-6 flex items-center text-sm font-bold border-slate-400 border gap-2 w-full hover:bg-lightRed">
                                    <img src={circleplus} alt="" /> <p>Add New Item</p>
                                  </button>
                                </Link>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input
                              value={row.quantity}
                              onChange={(e) => handleRowChange(index, "quantity", e.target.value)}
                              className=" text-center w-20"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input type="text" value={row.rate} disabled className="w-full text-center" placeholder='0' />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input value={row.amount} disabled className="w-full text-center" placeholder='0' />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder text-center">
                            <button onClick={() => removeRow(index)} className="text-red-500"><img src={trash} alt="" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
                <button onClick={addRow} className="bg-darkGreen text-darkRed flex item-center  font-bold rounded-lg py-2 px-1 mt-4 text-[#820000]">
                 <img src={circleplus} alt=""  className='mt-1 ms-1 h-4 w-5'/> Add Item 
                </button>


                <br /><br />



                {/* Notes and Terms */}
<div className="mb-4 -mt-10">
  <label className="block mb-2 font-normal">Add Notes</label>
  <textarea
    name="autoNotes" // Changed from "notes" to match the property in orderDetails
    value={orderDetails.autoNotes}
    onChange={updateOrder}
    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
    placeholder='Add a Note'
  ></textarea>
</div>

<div className="mb-4 -mt-3">
  <label className="block mb-1 font-normal">Terms & Conditions</label>
  <textarea
    name="termsAndConditions" // Changed from "terms" to match the property in orderDetails
    value={orderDetails.termsAndConditions}
    onChange={updateOrder}
    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
    placeholder='Add Terms and Condition of Your Business'
  ></textarea>
</div>

                <div className='flex justify-end mt-5'>
              <div>
                <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
                  Cancel
                </button>

              </div>
              {/* <div>
                <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
                  <img src={printer} className='me-1 mt-1 -ms-2' alt="" />
                  Print
                </button>
              </div> */}
              <div>
                <button className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]" onClick={handleAddUnload}>
                  Save
                </button>
              </div>

            </div>

              </div>
            </div>
          </div>
        {/* </div> */}



        <div className="flex w-[30%] h-[250px] p-6 rounded-lg shadow-md mt-12 bg-white">

          <div className='justify-center'>
            <div className='flex my-2'>
              <h3 className='text-[#4B5C79] text-[14px] font-normal'>Untaxed Amount</h3>
              <h1 className='text-[#303F58] text-[18px] font-bold ms-40'>Rs 0.00</h1>
            </div>
            <div className='flex my-1'>
              <h3 className='text-[#4B5C79] text-[14px] font-normal'>SGST</h3>
              <h1 className='text-[#4B5C79] text-[14px] font-normal ms-64'>Rs 0.00</h1>
            </div>
            <div className='flex my-1'>
              <h3 className='text-[#4B5C79] text-[14px] font-normal'>CGST</h3>
              <h1 className='text-[#4B5C79] text-[14px] font-normal ms-64'>Rs 0.00</h1>
            </div>
            <div className='flex my-1'>
              <h3 className='text-[#0B1320] text-[16px] font-bold'>Total</h3>
              <h1 className='text-[#303F58] text-[18px] font-bold ms-60'>Rs 0.00</h1>
            </div>

            <div className='flex ms-24 mt-5'>
              <div>
                <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
                  Cancel
                </button>

              </div>
              <div>
                <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
                  <img src={printer} className='me-1 mt-1 -ms-2' alt="" />
                  Print
                </button>
              </div>
              <div>
                <button className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]">
                  Save
                </button>
              </div>

            </div>



          </div>






        </div>
      </div>
    </>
  );
}

export default AddUnloadStock;