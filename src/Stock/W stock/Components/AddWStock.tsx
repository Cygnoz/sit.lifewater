import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { getItemsAPI } from "../../../services/StockAPI/StockAPI";
import { getWarehouseAPI } from "../../../services/WarehouseAPI/WarehouseAPI";
import downarrow from "../../../assets/images/Vector.png";
import circleplus from "../../../assets/images/Icon.svg";
import trash from "../../../assets/images/trash.svg";
import { Link } from "react-router-dom";
import back from "../../../assets/images/backbutton.svg";
import { STOCK_BASEURL } from "../../../services/Baseurl";
import { createStock} from "../../../services/StockAPI/W-StockAPI";


interface Item {
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  itemImage?: string;
  purchasePrice?:string
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
  transferNumber: number;
  items: Item[];
  notes: string;
  termsAndConditions: string;
}
// interface StockItem {
//   itemName: string;
//   quantity: number;
//   rate: number;
//   amount: number;
//   itemImage?: string; // Allow undefined
//   purchasePrice?: number;
// }



interface AddWStockProps {
  onAddNewItem?: () => void;
}

const AddWStock: React.FC<AddWStockProps> = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    warehouse: '',
  date: '',
  transferNumber: 0,
  items: [{ itemName: '', quantity: 0, rate: 0, amount: 0, itemImage: '' }], // Set to empty string
  notes: '',
  termsAndConditions: '',
});   
  console.log(orderDetails);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<Item[]>([]); // The full item list from your API
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  
  const defaultImage =
    "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png";

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await getWarehouseAPI();
        console.log("Warehouses data:", response.warehouses);
        setWarehouses(response.warehouses || []);
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    };
    fetchWarehouse();
  }, []);

  useEffect(() => {
    // Fetch the items list from API
    const fetchItems = async () => {
      setLoading(true);
      try {
        // Assuming fetchItemsAPI() fetches items
        const response = await getItemsAPI();
        setItems(response);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

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
      items: [...prev.items, { itemName: "", quantity: 0, rate: 0, amount: 0 ,itemImage: "" }],
    }));
    console.log(orderDetails);
  };

  const removeItem = (index: number) => {
    setOrderDetails((prev) => ({
      ...prev,
      items:
        prev.items.length > 1
          ? prev.items.filter((_, i) => i !== index)
          : [{ itemName: "", quantity: 0, rate: 0, amount: 0 }],
    }));
  };

  const handleItemSelect = (item: Item, index: number) => {
    const quantity = item.quantity || 1;
    const rate = Number(item.purchasePrice) || 0; // Ensure rate is a number
  
    setOrderDetails((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        itemName: item.itemName,
        quantity,
        rate,
        amount: rate * quantity,
        itemImage: item.itemImage,
      };
      return { ...prev, items: newItems };
    });
    setOpenDropdownId(null);
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
        [field]: field === "rate" || field === "quantity" ? Number(value) : value, // Ensure numbers
      };
  
      const quantity = Number(newItems[index].quantity) || 0;
      const rate = Number(newItems[index].rate) || 0;
      newItems[index].amount = rate * quantity;
  
      return { ...prev, items: newItems };
    });
  };
  

  const toggleDropdown = (index: number, type: string) => {
    setOpenDropdownId(index === openDropdownId ? null : index);
    setOpenDropdownType(type);
  };


  const handleSubmit = async () => {
    try {
      const orderWithDefaults = {
        ...orderDetails,
        items: orderDetails.items.map(item => ({
          ...item,
          itemImage: item.itemImage || defaultImage, // Fallback if `itemImage` is undefined
        })),
      };
      const response = await createStock(orderWithDefaults);
      console.log('Stock created:', response);
      // Reset form or show a success message if needed
    } catch (error: any) {
      console.error(error.message);
      // Show an error message to the user
    }
  };
  

  

  return (
    <>
      <div className="flex my-1">
        <div className="max-h-screen w-[70%] ">
          {/* Main content */}
          <div className="flex-1 min-h-screen ">
            <div className="container mx-auto p-1 ">
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

              <div className="bg-white p-4 -mt-4 rounded-lg shadow-md">
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
                    />
                  </div>
                </div>

                {/* Date and Order Number */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-medium text-[#303F58] text-[14px]">
                      Transfer Number
                    </label>

                    <input
                      type="text"
                      name="transferNumber"
                      value={orderDetails.transferNumber}
                      onChange={updateOrder}
                      placeholder="123"
                      className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px]"
                    />
                  </div>
                </div>

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
                          <td className="border-y py-3 px-2 border-tableBorder">
                            <div
                              className="relative w-full"
                              onClick={() =>
                                toggleDropdown(index, "searchProduct")
                              }
                            >
                              {item.itemName ? (
                                <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <div className="flex items-start col-span-4">
                                    <img
                                      className="rounded-full h-10 w-10"
                                      src={
                                        item.itemImage
                                          ? `${STOCK_BASEURL}/${item.itemImage.replace(
                                              /\\/g,
                                              "/"
                                            )}`
                                          : defaultImage
                                      }
                                      alt={`${item.itemName}`}
                                    />
                                  </div>
                                  <div className="col-span-8 text-start">
                                    <p className="text-textColor">
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
                                        <div className="col-span-2 flex justify-center">
                                          <img
                                            className="rounded-full h-10"
                                            src={
                                              filteredItem.itemImage
                                                ? `${STOCK_BASEURL}/${filteredItem.itemImage.replace(
                                                    /\\/g,
                                                    "/"
                                                  )}`
                                                : defaultImage
                                            }
                                            alt={
                                              filteredItem.itemImage ||
                                              "default image"
                                            }
                                          />
                                        </div>
                                        <div className="col-span-10 flex">
                                          <div className="text-start">
                                            <p className="font-bold text-sm text-black">
                                              {filteredItem.itemName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Rate: RS.
                                              {filteredItem.purchasePrice}
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
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input
                              type="text"
                              value={item.rate}
                              disabled
                              className="w-full text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input
                              value={item.amount}
                              disabled
                              className="w-full text-center"
                              placeholder="0"
                            />
                          </td>
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
                <div>
                <button onClick={handleSubmit} className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]">
                  Save
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-[30%] h-[250px] p-4 mt-10 rounded-lg shadow-md  bg-white">
          <div className="justify-center">
            <div className="flex my-2">
              <h3 className="text-[#4B5C79] text-[14px]">Untaxed Amount</h3>
              <h1 className="text-[#303F58] text-[18px] font-bold ms-40">
                Rs 0.00
              </h1>
            </div>
            <div className="flex my-1">
              <h3 className="text-[#4B5C79] text-[14px]">SGST</h3>
              <h1 className="text-[#4B5C79] text-[14px] ms-64">Rs 0.00</h1>
            </div>
            <div className="flex my-1">
              <h3 className="text-[#4B5C79] text-[14px]">CGST</h3>
              <h1 className="text-[#4B5C79] text-[14px] ms-64">Rs 0.00</h1>
            </div>
            <div className="flex my-1">
              <h3 className="text-[#0B1320] text-[16px] font-bold">Total</h3>
              <h1 className="text-[#303F58] text-[18px] font-bold ms-60">
                Rs 0.00
              </h1>
            </div>

            <div className="flex ms-24 mt-5">
              <div>
                <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
                  Cancel
                </button>
              </div>
              <div>
                <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
                  {/* <img src={printer} className="me-1 mt-1 -ms-2" alt="" /> */}
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
};

export default AddWStock;
