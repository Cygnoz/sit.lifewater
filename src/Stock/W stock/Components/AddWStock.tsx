import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import downarrow from "../../../assets/images/Vector.png";
import circleplus from "../../../assets/images/Icon.svg";
import trash from "../../../assets/images/trash.svg";
import { Link, useNavigate } from "react-router-dom";
import back from "../../../assets/images/backbutton.svg";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";
import { toast, ToastContainer } from "react-toastify";
import Button from "../../../commoncomponents/Buttons/Button";

interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
  costPrice: number;
  amount: number;
  _id?: string;
  resaleable?: boolean;
}

interface WarehouseItem {
  _id: string;
  warehouseName: string;
  contactNo: string;
  address: string;
}

interface OrderDetails {
  warehouse: string;
  date: string;
  transferNumber: string;
  items: Item[];
  notes: string;
  termsAndConditions: string;
  _id?: string;
}
interface AddWStockProps {
  onAddNewItem?: () => void;
}

const AddWStock: React.FC<AddWStockProps> = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    warehouse: "",
    date: "",
    transferNumber: "",
    items: [
      {
        itemId: "",
        itemName: "",
        quantity: 0,
        costPrice: 0,
        amount: 0,
        resaleable: false,
      },
    ], // Set to empty string
    notes: "",
    termsAndConditions: "",
  });
  console.log(orderDetails);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<Item[]>([]); // The full item list from your API
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const navigate = useNavigate();

  const { request: getWarehouseData } = useApi("get", 4001);
  const getAllWarehouse = async () => {
    try {
      const url = `${endpoints.GET_ALL_WAREHOUSE}`;
      const { response, error } = await getWarehouseData(url);
      if (!error && response) {
        setWarehouses(response.data.warehouses);
        console.log(response.data.warehouses);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { request: getItems } = useApi("get", 4001);

  const getAllItems = async () => {
    try {
      const url = `${endpoints.GET_ALL_ITEMS}`;
      const { response, error } = await getItems(url);

      if (!error && response) {
        setLoading(false);
        setItems(response.data);
        console.log(response.data, "Items");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllWarehouse(), getAllItems();
  }, []);

  // Transffer number auto generating

  const [stocks, setStocks] = useState([]);
console.log(stocks);

const { request: getWStockData } = useApi("get", 4001);

useEffect(() => {
  const getAllWarehouseStock = async () => {
    try {
      const url = `${endpoints.GET_W_STOCK}`;
      const { response, error } = await getWStockData(url);
      if (!error && response && response.data && Array.isArray(response.data.data)) {
        setStocks(response.data.data);
        console.log("here", response.data.data);          

        // Auto-generate the transfer number
        const count = response.data.data.length; // Current number of stocks
        const newTransferNumber = `TN-${count + 1}`; // Auto-generate with prefix TN-
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
  };

  getAllWarehouseStock();
}, []); // Add dependencies if necessary



  // Filtered items excluding already selected ones
  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchValue.toLowerCase()) &&
      !orderDetails.items.some(
        (orderItem) => orderItem.itemName === item.itemName
      )
  );

  const updateOrder = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
    console.log(orderDetails);
  };

  const addItem = () => {
    setOrderDetails((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: "",
          itemName: "",
          quantity: 0,
          costPrice: 0,
          amount: 0,
          resaleable: false,
        },
      ],
    }));
    console.log(orderDetails);
  };

  const removeItem = (index: number) => {
    setOrderDetails((prev) => ({
      ...prev,
      items:
        prev.items.length > 1
          ? prev.items.filter((_, i) => i !== index)
          : [
              {
                itemId: "",
                itemName: "",
                quantity: 0,
                costPrice: 0,
                amount: 0,
                _id: "",
                resaleable: false,
              },
            ],
    }));
  };

  const handleItemSelect = (item: Item, index: number) => {
    const quantity = 1; // Default quantity is 1
    const costPrice = item.costPrice; // Set rate as the sellingPrice

    setOrderDetails((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        itemId: item._id || "",
        itemName: item.itemName,
        quantity,
        costPrice,
        amount: costPrice * quantity, // Calculate amount based on rate and quantity
        resaleable: item.resaleable,
      };
      return { ...prev, items: newItems };
    });

    setOpenDropdownId(null); // Close the dropdown
    setOpenDropdownType(null);
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    setOrderDetails((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]:
          field === "costPrice" || field === "quantity" ? Number(value) : value, // Ensure numbers
      };

      const quantity = Number(newItems[index].quantity) || 0;
      const costPrice = Number(newItems[index].costPrice) || 0;
      newItems[index].amount = costPrice * quantity;

      return { ...prev, items: newItems };
    });
  };

  const toggleDropdown = (index: number, type: string) => {
    setOpenDropdownId(index === openDropdownId ? null : index);
    setOpenDropdownType(type);
  };

  const { request: AddItems } = useApi("post", 4001);

  const handleSubmit = async () => {
    try {
      const orderWithDefaults = {
        ...orderDetails,
        items: orderDetails.items.map((item) => ({
          ...item,
        })),
      };
      const url = `${endpoints.ADD_W_STOCK}`;
      const { response, error } = await AddItems(url, orderWithDefaults);
      if (!error && response) {
        console.log("Stock", response);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/warstock");
        }, 1000);
      }
      console.log(error);
      toast.error(error.response.data.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.data.message);
    }
  };

  return (
    <>
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
      <div className="flex my-1">
        <div className="max-h-screen w-full ">
          {/* Main content */}
          <div className="flex-1 mx-3 min-h-screen ">
            <div className=" mx-auto p-1 ">
              <div className="flex gap-2 ">
                <Link to="/warstock">
                  <img
                    className="bg-gray-200  rounded-full p-1.5"
                    src={back}
                    alt="Back"
                  />
                </Link>
                <h1 className="text-[20px] font-[700]  mb-6 text-[#303F58]">
                  Add W-Stock
                </h1>
              </div>

              <div className="bg-white p-8 -mt-4 rounded-lg shadow-md">
                {/* Customer and Salesman Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-medium text-[#303F58] text-[14px]">
                      Warehouse
                    </label>
                    <select
                      name="warehouse"
                      value={orderDetails.warehouse}
                      onChange={updateOrder}
                      className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px]"
                    >
                      <option value="" disabled>
                        Select Warehouse
                      </option>
                      {warehouses.map((item) => (
                        <option value={item.warehouseName}>
                          {item.warehouseName}
                        </option>
                      ))}
                      {/* Add customer options */}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-[#303F58] text-[14px]">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={orderDetails.date}
                      onChange={updateOrder}
                      className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px]"
                      required
                    />
                  </div>
                </div>

                {/* Date and Order Number */}
                {/* <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-medium text-[#303F58] text-[14px]">
                      Transfer Number
                    </label>

                    <input
                      type="text"
                      name="transferNumber"
                      value={orderDetails.transferNumber}
                      onChange={updateOrder}
                      placeholder=""
                      className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px]"
                    />
                  </div>
                </div> */}

                {/* Add Item Section */}
                <div className="rounded-lg border-2 border-tableBorder mt-5">
                  <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
                    <thead className="text-[12px] text-center bg-[#FDF8F0] text-dropdownText">
                      <tr className="bg-lightPink">
                        {[
                          "Product",
                          "Quantity",
                          "Rate",
                          "Amount",
                          "Actions",
                        ].map((item, index) => (
                          <th
                            key={index}
                            className="py-2 px-4 font-medium border-b border-tableBorder relative"
                          >
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-dropdownText text-center text-[13px]">
                      {orderDetails.items.map((item, index) => (
                        <tr key={index}>
                          {/* Product Selection */}
                          <td className="border-y py-3 px-2 border-tableBorder">
                            <div
                              className="relative w-full"
                              onClick={() =>
                                toggleDropdown(index, "searchProduct")
                              }
                            >
                              {item.itemName ? (
                                <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <div className="col-span-8 text-start">
                                    <p className="text-textColor text-center">
                                      {item.itemName}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm gap-2">
                                  <p>Type or click</p>
                                  <p>
                                    <img src={downarrow} alt="" width={12} />
                                  </p>
                                </div>
                              )}
                            </div>
                            {/* Dropdown for selecting items */}
                            {openDropdownId === index &&
                              openDropdownType === "searchProduct" && (
                                <div
                                  ref={dropdownRef}
                                  className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[40%] space-y-1"
                                >
                                  <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) =>
                                      setSearchValue(e.target.value)
                                    }
                                    placeholder="Select Item"
                                    className="w-full p-2 border rounded-lg h-12 bg-[#F9F7F5]"
                                  />
                                  {loading ? (
                                    <p>Loading...</p>
                                  ) : filteredItems.length > 0 ? (
                                    filteredItems.map((filteredItem, idx) => (
                                      <div
                                        key={idx}
                                        onClick={() =>
                                          handleItemSelect(filteredItem, index)
                                        }
                                        className="grid bg-[#FDF8F0] grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg"
                                      >
                                        <div className="col-span-10 flex">
                                          <div className="text-start">
                                            <p className="font-bold text-sm text-black">
                                              {filteredItem.itemName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              AED: {filteredItem.costPrice}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center border-slate-400 border rounded-lg">
                                      <p className="text-red-500 text-sm py-4">
                                        Items Not Found!
                                      </p>
                                    </div>
                                  )}
                                  <Link to="/additem">
                                    <button className="bg-darkGreen text-[#820000] mt-1 rounded-lg py-4 px-6 flex items-center text-sm font-bold border-slate-400 border gap-2 w-full hover:bg-lightRed">
                                      <img src={circleplus} alt="" />{" "}
                                      <p>Add New Item</p>
                                    </button>
                                  </Link>
                                </div>
                              )}
                          </td>
                          {/* Quantity Input */}
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="text-center w-20"
                              placeholder="0"
                            />
                          </td>
                          {/* Rate Display */}
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input
                              type="number"
                              value={item.costPrice}
                              disabled
                              className="w-full text-center"
                              placeholder="0"
                            />
                            <input
                              type="hidden" // Hidden input for itemId
                              value={item.itemId}
                            />
                          </td>

                          {/* Amount Display */}
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input
                              value={item.amount}
                              disabled
                              className="w-full text-center"
                              placeholder="0"
                            />
                          </td>
                          {/* Actions */}
                          <td className="py-2.5 px-4 border-y border-tableBorder text-center">
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-500 px-2 py-1"
                            >
                              <img src={trash} alt="" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  className="flex items-center text-[#820000] text-md font-bold gap-2 mx-1 my-4"
                  onClick={addItem}
                >
                  <img src={circleplus} alt="" /> <p>Add Item</p>
                </button>

                {/* Notes and Terms */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Add Notes</label>
                  <textarea
                    name="notes"
                    value={orderDetails.notes}
                    onChange={updateOrder}
                    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px]"
                    placeholder="Add Note"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Terms & Conditions
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={orderDetails.termsAndConditions}
                    onChange={updateOrder}
                    className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px]"
                    placeholder="Add Terms and Condition of Your Business"
                  ></textarea>
                </div>

                {/* Total and Actions */}
                <div className="flex justify-end space-x-4 mt-3">
                  <Button variant="fourthiary">Cancel</Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddWStock;
