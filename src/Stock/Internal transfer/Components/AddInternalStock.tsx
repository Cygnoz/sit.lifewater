
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import trash from '../../../assets/images/trash.svg'
import circleplus from '../../../assets/images/Icon.svg'
import back from '../../../assets/images/backbutton.svg'
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../commoncomponents/Buttons/Button';
import downarrow from '../../../assets/images/Vector.png';
import useApi from '../../../Hook/UseApi';
import { endpoints } from '../../../services/ApiEndpoint';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';

interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
}

interface OrderDetails {
  fromRoute: string;
  fromRouteId: string;
  toRouteId: string;
  toRoute: string;
  notes: string;
  termsAndConditions: "";
  date: string;
  stock: Item[],
  transferNumber: string,
}

const AddInternalStock: React.FC = () => {
  // const [loading, setLoading] = useState(true); // State to manage loading state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const [initialQuantity, setInitialQuantity] = useState(Number)
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    fromRoute: '',
    fromRouteId: '',
    toRouteId: '',
    toRoute: 'IN-3748',
    notes: '',
    termsAndConditions: '',
    date: '',
    stock: [
      {
        itemId: '', itemName: '', quantity: 0
      }
    ],
    transferNumber: "",
  });

  console.log("Input Data", orderDetails);

  const addItem = () => {
    setOrderDetails((prev) => ({
      ...prev,
      stock: [
        ...prev.stock,
        {
          itemId: '', itemName: '', quantity: 0
        },
      ],
    }));
    console.log(orderDetails);
  };

  // Remove a item
  const removeItem = (index: number) => {
    setOrderDetails((prev) => ({
      ...prev,
      stock:
        prev.stock.length > 1
          ? prev.stock.filter((_, i) => i !== index)
          : [
            {
              itemId: '', itemName: '', quantity: 0
            },
          ],
    }));
  };

  // Handle item selection
  const handleItemSelect = (item: Item, index: number, quantity: any) => {

    setOrderDetails((prev) => {
      const newItems = [...prev.stock];
      // Ensure the index exists in the stock array
      newItems[index] = {
        ...newItems[index],
        itemId: item.itemId || "",
        itemName: item.itemName || "",
        quantity: 1,
      };
      setInitialQuantity(quantity)
      console.log(initialQuantity, "qnt");
      return { ...prev, stock: newItems };
    });

    setOpenDropdownId(null); // Close the dropdown
    setOpenDropdownType(null);
  };

  const handleItemChange = (index: number, key: string, value: string) => {
    const quantity = parseInt(value, 10); // Convert value to number

    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    if (quantity > initialQuantity) {
      setError(`Only ${initialQuantity} units are left in stock.`);
      return;
    }
    if (quantity === initialQuantity) {
      setError("Warning: This item is now out of stock.");
    } else {
      setError("");
    }

    setOrderDetails((prev) => {
      const newItems = [...prev.stock];
      newItems[index] = {
        ...newItems[index],
        [key]: quantity, // Update the specific key with the validated numeric value
      };
      return { ...prev, stock: newItems };
    });
  }

  const toggleDropdown = (index: number, type: string) => {
    setOpenDropdownId(index === openDropdownId ? null : index);
    setOpenDropdownType(type);
  };

  // Close dropdown on outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdownId(null);
      setOpenDropdownType(null);
    }
  };

  const [itemData, setItemData] = useState<Item[]>([]); // The full item list from your API
  console.log(itemData, "items");

  const filteredItems = itemData?.filter(
    (item) =>
      !orderDetails.stock.some(
        (orderItem) => orderItem.itemName === item.itemName
      )
  );

  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

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

  const [subRoutes, setSubRoutes] = useState<any[]>([])
  const { request: getSubRoutes } = useApi("get", 4000)
  const getALLSubroute = async () => {
    try {
      // setLoading(true)
      const url = `${endpoints.GET_ALL_SUBROUTE}`
      const { response, error } = await getSubRoutes(url)
      console.log("API RESPONSE :", response)
      if (!error && response) {
        // setLoading(false)
        setSubRoutes(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getALLSubroute()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update specific field in orderData
    setOrderDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleRouteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubRouteId = e.target.value;

    // Find the selected subRoute from the subRoutes array
    const selectedSubRoute = subRoutes.find((route) => route._id === selectedSubRouteId);

    if (selectedSubRoute) {
      if (orderDetails.toRouteId === selectedSubRoute._id) {
        toast.error("From Route and To Route cannot be the same.");
        return;
      }

      setItemData(selectedSubRoute.stock);
      console.log(itemData, "items");

      // Update orderDetails with the selected subRoute's details
      setOrderDetails({
        ...orderDetails,
        fromRoute: selectedSubRoute.subRouteName,
        fromRouteId: selectedSubRoute._id,
      });
    }
  };

  const handleToRouteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToRouteId = e.target.value;

    // Find the selected subRoute
    const selectedToRoute = subRoutes.find((route) => route._id === selectedToRouteId);

    if (selectedToRoute) {
      if (orderDetails.fromRouteId === selectedToRoute._id) {
        toast.error("From Route and To Route cannot be the same.");
        return;
      }

      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        toRoute: selectedToRoute.subRouteName,
        toRouteId: selectedToRoute._id,
      }));
    }
  };

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss'); // Format: YYYY-MM-DD HH:MM:SS
    setOrderDetails((prevData) => ({ ...prevData, date: formattedDateTime }));
  }, []);

  const { request: AddInternalTransfer } = useApi("put", 4001);
  const handleSubmit = async () => {
    if (!orderDetails.fromRoute) {
      toast.error("Select a from route.");
      return;
    }
    if (!orderDetails.toRoute) {
      toast.error("Select a to route.");
      return;
    }
  
    
    const hasValidItem = orderDetails.stock.some((item) => item.itemId.trim() !== '');
    if (!hasValidItem) {
      toast.error("Select at least one item.");
      return;
    }
    try {
      const url = `${endpoints.ADD_INTERNAL_TRANSFER}`;
      const { response, error } = await AddInternalTransfer(url, orderDetails)
      if (!error && response) {
        console.log('Order', response);
        toast.success(response.data.message);
        setTimeout(() => {
            navigate("/internaltransfer")
        }, 1000)
      }
      console.log(error);
      toast.error(error.response.data.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data.message);
    }
  };

  const { request: getAllTransfer } = useApi("get", 4001);

  useEffect(() => {
    const getTransfer = async () => {
      try {
        const url = `${endpoints.GET_INTERNAL_TRANSFER}`;
        const { response, error } = await getAllTransfer(url);
        if (!error && response) {
          // Auto-generate the transfer number
          const count = response.data.length; // Current number of stocks
          const newTransferNumber = `INT-${count + 1}`; // Auto-generate with prefix TN-
          setOrderDetails((prev) => ({
            ...prev,
            transferNumber: newTransferNumber,
          })); // Update transfer number
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTransfer()
  }, [])

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className='flex'>

        <div className="max-h-screen w-full">
          {/* Main content */}
          <div className="flex-">
            <div className="flex gap-3 items-center w-full ms-1 mt-2">
              <Link to="/internaltransfer">
                <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
              </Link>
              <h3 className="text-[20px] text-[#303F58] font-bold ms-1">Add New Internal Stock</h3>
            </div>
            <div className=" px-4 w-full py-2">
              <div className="bg-white py-4 px-10 mt-1 rounded-lg shadow-md">
                {/* Customer and Salesman Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">From</label>
                    <select
                      name="fromRoute"
                      value={orderDetails.fromRouteId}
                      onChange={handleRouteSelect}
                      className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                    >
                      <option value="" className="font-normal">
                        Select Sub Route
                      </option>
                      {subRoutes.length > 0 ? (
                        subRoutes.map((route) => (
                          <option key={route._id} value={route._id}>
                            {route.subRouteName}
                          </option>
                        ))
                      ) : (
                        <div>No SubRoutes Found</div>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">To</label>
                    <select
                      name="customer"
                      value={orderDetails.toRouteId} // Bind the value to toRouteId for proper selection
                      onChange={handleToRouteSelect}
                      className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                    >
                      <option value="" className="font-normal">Select Sub Route</option>
                      {subRoutes.length > 0 ? (
                        subRoutes.map((route) => (
                          <option key={route._id} value={route._id}>
                            {route.subRouteName}
                          </option>
                        ))
                      ) : (
                        <div>
                          No SubRoutes Found
                        </div>
                      )}
                    </select>
                  </div>
                </div>
{/* 
                <div className="mb-4">
                  <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Transfer Number</label>

                  <input
                    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                    type="text"
                    name="transferNumber"
                    value={orderDetails.transferNumber}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div> */}

                {/* Add Item Section */}
                <div className="mb-4">
                  <h5 className="font-bold items-center  mt-2 justify-center mb-2 text-[#202224] text-[16px]">Add Item</h5>
                  <table className="w-[80%] ms-32 my-5 text-left">
                    <thead className="bg-[#fdf8f0]">
                      <tr className="border-b">
                        {["Item Name", "Quantity", "Actions"].map((item, index) => (
                          <th key={index} className="p-2 text-[#495160] text-[12px] text-center font-medium">
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.stock.map((item, index) => (
                        <tr key={index}>
                          <td className="border-y py-3 px-2 border-tableBorder">
                            <div className="relative w-full" onClick={() => toggleDropdown(index, "searchProduct")}>
                              {item.itemName ? (
                                <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <div className="col-span-8 text-start">
                                    <p className="text-textColor text-center">{item.itemName}</p>
                                    <p className="text-textColor text-[12px] text-center">Quantity : {initialQuantity}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <p>Type or click</p>&nbsp;&nbsp;
                                  <p><img src={downarrow} alt="" width={12} /></p>
                                </div>
                              )}
                            </div>
                            {openDropdownId === index && openDropdownType === "searchProduct" && (
                              <div ref={dropdownRef} className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[40%] space-y-1">
                                {filteredItems?.length > 0 ? (
                                  filteredItems?.map((item: any, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => handleItemSelect(item, index, item.quantity)}
                                      className="grid bg-[#FDF8F0] grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg"
                                    >
                                      <div className="col-span-10 flex">
                                        <p className="font-bold text-sm text-black">{item.itemName}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-[red] text-sm py-4">Items Not Found!</p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder text-center">
                            <input
                              key={index}
                              type="number"
                              min="1" // Prevents user from typing negative values in the input
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                              className="p-1 text-center border rounded-md"
                            />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder text-center">
                            <button onClick={() =>
                              removeItem(index)}
                              className="text-red-500">
                              <img src={trash} alt="Delete" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-red-500 text-center text-sm mt-2">{error}</p>
                  <button onClick={addItem} className=" ms-32 bg-darkGreen text-darkRed flex item-center  font-bold rounded-lg  px-1 text-[#820000]">
                    <img src={circleplus} alt="" className='mt-1 ms-1 h-4 w-5' /> Add Item
                  </button>
                </div>

                {/* Notes and Terms */}
                <div className="mb-4">
                  <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Add Notes</label>
                  <textarea
                    name="notes"
                    value={orderDetails.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                    placeholder='Add a Note'
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Terms & Conditions</label>
                  <textarea
                    name="termsAndConditions"
                    value={orderDetails.termsAndConditions}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                    placeholder='Add Terms and Condition of Your Business'
                  ></textarea>

                </div>

                {/* Total and Actions */}
                <div className='flex justify-end gap-2 my-3 pt-2'>
                  <Link to={"/internaltransfer"}>
                  <Button variant="fourthiary">
                    Cancel
                  </Button>
                  </Link>
                  <Button onClick={handleSubmit} variant="primary">
                    Save
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInternalStock;