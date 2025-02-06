import React, {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  useContext,
} from "react";

import downarrow from "../../../assets/images/Vector.png";
import circleplus from "../../../assets/images/Icon.svg";
import trash from "../../../assets/images/trash.svg";
import { Link, useNavigate } from "react-router-dom";
import back from "../../../assets/images/backbutton.svg";
import { endpoints } from "../../../services/ApiEndpoint";
import { WarehouseResponseContext } from "../../../Context/ContextShare";
import { toast, ToastContainer } from "react-toastify";
import useApi from "../../../Hook/UseApi";

interface Item {
  itemName: string;
  quantity: number;
  itemId?: string;
}

interface WarehouseItem {
  _id: string;
  warehouseName: string;
  contactNo: string;
  address: string;
  stock: [];
}
interface OrderDetails {
  mainRouteId: string;
  mainRouteName: string;
  subRouteId: string;
  subRouteName: string;
  warehouseId: string;
  warehouseName: string;
  transferNumber: string;
  stock: Item[]; // Array of items
  notes?: string; // Optional notes
  date?: string;
  termsAndConditions?: string; // Optional terms and conditions
}
interface Route {
  _id: string;
  subRouteName: string;
  mainRouteName: string;
  mainRouteId: string;
  subRouteId: string;
}

const AddStockloaded: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    mainRouteId: "",
    mainRouteName: "",
    subRouteId: "",
    subRouteName: "",
    warehouseId: "",
    warehouseName: "",
    transferNumber: "",
    stock: [
      {
        itemId: "",
        itemName: "",
        quantity: 0,
      },
    ],
    notes: "",
    termsAndConditions: "",
  });
  console.log(orderDetails);
  const [availableQuantity, setAvailableQuantity] = useState(Number);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [selectedMainRoute, setSelectedMainRoute] = useState<string>("");
  const [selectedSubRoute, setSelectedSubRoute] = useState("");
  const [filteredSubRoutes, setFilteredSubRoutes] = useState<Route[]>([]);
  const [routesList, setRouteList] = useState<Route[]>([]);
  const [mainRouteList, setMainRouteList] = useState<string[]>([]);

  console.log(routesList);
  const { request: getWarehouseData } = useApi("get", 4001);

  const { request: getSubRoute } = useApi("get", 4000);
  const handleMainRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const mainRouteName = event.target.value;

    // Find the selected route object to get mainRouteId
    const selectedRoute = routesList.find(
      (route) => route.mainRouteName === mainRouteName
    );

    const mainRouteId = selectedRoute ? selectedRoute.mainRouteId : "";

    setSelectedMainRoute(mainRouteName);

    // Filter subroutes based on the selected main route
    const filtered = routesList.filter(
      (route) => route.mainRouteName === mainRouteName
    );

    setFilteredSubRoutes(filtered);

    // Update the orderDetails with the selected mainRouteName and mainRouteId
    setOrderDetails((prev) => ({
      ...prev,
      mainRouteName, // Update the main route name
      mainRouteId, // Update the main route ID
      subRouteName: "", // Clear subroute when main route changes
    }));
  };

  const handleSubRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subRouteName = event.target.value;

    // Find the selected sub-route object to get subRouteId
    const selectedSubRoute = filteredSubRoutes.find(
      (route) => route.subRouteName === subRouteName
    );

    const subRouteId = selectedSubRoute ? selectedSubRoute._id : "";

    setSelectedSubRoute(subRouteName);

    // Update the orderDetails with the selected subRouteName and subRouteId
    setOrderDetails((prev) => ({
      ...prev,
      subRouteName, // Update the sub-route name
      subRouteId, // Update the sub-route ID
    }));
  };

  useEffect(() => {
    // Fetch the routes list
    const fetchSubRoutes = async () => {
      try {
        const url = `${endpoints.GET_ALL_SUBROUTE}`;
        const { response, error } = await getSubRoute(url);

        if (error) {
          console.error("Error fetching sub-route data:", error);
          toast.error("Failed to fetch route data. Please try again.");
          return;
        }

        const routes = Array.isArray(response) ? response : response?.data;

        if (routes && Array.isArray(routes)) {
          // Set the routes list for filtering
          setRouteList(routes);

          // Extract unique main routes
          const uniqueMainRoutes = Array.from(
            new Set(routes.map((route: Route) => route.mainRouteName))
          );
          setMainRouteList(uniqueMainRoutes as string[]);
        }
      } catch (err) {
        console.error("Error fetching sub-route data:", err);
        toast.error("An unexpected error occurred. Please try again.");
      }
    };

    fetchSubRoutes();
  }, []);

  // warehouses
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseItem | null>(null);
  // Handle warehouse selection
  const handleWarehouseChange = (event: any) => {
    const warehouseId = event.target.value;
    // Find the selected warehouse object
    const selectedWarehouse = warehouses.find((w) => w._id === warehouseId);
    const warehouseName = selectedWarehouse
      ? selectedWarehouse.warehouseName
      : "";
    setSelectedWarehouse(selectedWarehouse || null);
    // Update the orderDetails with the selected warehouseName and warehouseId
    setOrderDetails((prev) => ({
      ...prev,
      warehouseId, // Store the warehouse ID
      warehouseName, // Store the warehouse name
    }));
  };

  const filteredItems = selectedWarehouse ? selectedWarehouse.stock : [];

  const { setWarehouseResponse } = useContext(WarehouseResponseContext)!;

  const getAllWarehouse = async () => {
    try {
      const url = `${endpoints.GET_ALL_WAREHOUSE}`;
      const { response, error } = await getWarehouseData(url);
      if (!error && response) {
        setWarehouses(response.data.warehouses);
        console.log(response.data.warehouses, "warehouse");
        setWarehouseResponse(response.data.warehouses);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllWarehouse();
  }, []);

  const handleItemSelect = (selectedItem: any, index: number) => {
    setOrderDetails((prev) => {
      const updatedStock = [...prev.stock];
      updatedStock[index] = {
        ...updatedStock[index],
        itemId: selectedItem.itemId, // Set itemId
        itemName: selectedItem.itemName, // Set itemName
        quantity: selectedItem.quantity, // Set quantity
      };
      setAvailableQuantity(selectedItem.quantity)
      return { ...prev, stock: updatedStock };
    });
    setOpenDropdownId(null); // Close the dropdown
  };

  const updateOrder = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setOrderDetails((prev) => ({
      ...prev,
      [name]: value, // Dynamically updating the orderDetails based on the field name
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    setOrderDetails((prev) => {
      const newItems = [...prev.stock];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };

      // If the field is 'quantity', convert to a number
      if (field === "quantity") {
        newItems[index].quantity = Number(value) || 0;
      }

      return { ...prev, stock: newItems };
    });
  };

  const removeItem = (index: number) => {
    setOrderDetails((prev) => ({
      ...prev,
      stock:
        prev.stock.length > 1
          ? prev.stock.filter((_, i) => i !== index)
          : [{ itemId: "", itemName: "", quantity: 0 }], // Keep only itemId, itemName, and quantity
    }));
  };

  const addItem = () => {
    setOrderDetails((prev) => ({
      ...prev,
      stock: [
        ...prev.stock,
        { itemId: "", itemName: "", quantity: 0 }, // Add a blank row with itemId, itemName, and quantity
      ],
    }));
  };

  const toggleDropdown = (index: number, type: string) => {
    setOpenDropdownId(index === openDropdownId ? null : index);
    setOpenDropdownType(type);
  };

  console.log("Loading stock details : ", orderDetails);
  // auto generating transfer number

  const [stocks, setStocks] = useState([]);
  console.log(stocks);


  const { request: getStockData } = useApi("get", 4001);
  useEffect(() => {
    const getAllStock = async () => {
      try {
        const url = `${endpoints.GET_ALL_LOADED_STOCK}`;
        const { response, error } = await getStockData(url);
        if (!error && response) {
          setStocks(response.data);



          // Auto-generate the transfer number
          const count = response.data.length; // Current number of stocks
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

    getAllStock();
  }, []); // Add dependencies if necessary
  const { request: AddStockLoad } = useApi("post", 4001);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (availableQuantity < orderDetails.stock[0].quantity) {
      toast.error(
        `Insufficient quantity! Available: ${availableQuantity}, Required: ${orderDetails.stock[0].quantity}`,
      )
      return;
    }
    try {
      const url = `${endpoints.ADD_STOCK_LOAD}`;
      const { response, error } = await AddStockLoad(url, orderDetails);
      if (!error && response) {
        console.log("Stock :", response);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/stockloaded");
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
      <div className="">
        <div className="max-h-screen mx-auto">
          {/* Main content */}
          <div className="flex-1 min-h-screen">
            <div className="flex gap-3 items-center w-full max-w-8xl ms-1 mt-2">
              <Link to="/stockloaded">
                <img
                  className="bg-gray-200 rounded-full p-2"
                  src={back}
                  alt="Back"
                />
              </Link>
              <h3 className="text-[20px] text-[#303F58] font-bold ms-1">
                Add Stock
              </h3>
            </div>
            <div className="container mx-auto p-4">
              <div className="bg-white p-4 -mt-1 -ms-2 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
                      Main Route
                    </label>
                    <select
                      name="mainRouteName"
                      value={selectedMainRoute}
                      onChange={handleMainRouteChange} // Updated to handle main route change
                      className="w-full p-2 border rounded-md  text-[#000000] text-[14px] font-normal"
                    >
                      <option value="" className="font-normal">
                        Select Main Route
                      </option>
                      {mainRouteList.map((mainRouteName) => (
                        <option key={mainRouteName} value={mainRouteName}>
                          {mainRouteName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
                      Sub Route
                    </label>
                    <select
                      name="subRouteName"
                      value={selectedSubRoute}
                      onChange={handleSubRouteChange} // Updated to handle sub route change
                      className="w-full p-2 border rounded-md  text-[#000000] text-[14px] font-normal"
                    >
                      <option value="">Select Sub Route</option>
                      {filteredSubRoutes.map((route) => (
                        <option key={route._id} value={route.subRouteName}>
                          {route.subRouteName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Order Number */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
                      Warehouse
                    </label>
                    <select
                      onChange={handleWarehouseChange}
                      className="w-full p-2 border rounded-md  text-[#000000] text-[14px] font-normal"
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse._id} value={warehouse._id}>
                          {warehouse.warehouseName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={orderDetails.date}
                      onChange={updateOrder}
                      className="w-full p-2 border rounded-md  text-[#000000] text-[14px] font-normal"
                    />
                  </div>


                </div>

                {/* Add Item Section */}
                <div className="rounded-lg border-2 border-tableBorder mt-5">
                  <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
                    <thead className="text-[12px] text-center bg-[#FDF8F0] text-dropdownText">
                      <tr className="bg-lightPink">
                        {["Product", "Quantity", "Actions"].map(
                          (item, index) => (
                            <th
                              key={index}
                              className="py-2 px-4 font-medium border-b border-tableBorder relative"
                            >
                              {item}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-dropdownText text-center text-[13px]">
                      {orderDetails.stock.map((item, index) => (
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
                                  <div className="col-span-8 text-start">
                                    <p className="text-textColor">
                                      {item.itemName}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm gap-2"
                                  onClick={() =>
                                    toggleDropdown(index, "searchProduct")
                                  } // Show dropdown when clicked
                                >
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

                                  {filteredItems.length > 0 ? (
                                    filteredItems.map(
                                      (item: any, idx: number) => (
                                        <div
                                          key={idx}
                                          onClick={() =>
                                            handleItemSelect(item, idx)
                                          } // Handle item selection
                                          className="grid bg-[#FDF8F0] grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg"
                                        >
                                          <div className="col-span-10 flex">
                                            <div className="text-start">
                                              <p className="font-bold text-sm text-black">
                                                {item.itemName}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )
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
                          <td className="py-2.5 px-4 border-y border-tableBorder flex-row">

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
                            {
                              availableQuantity ? <p className="text-[#77726a] text-[11px]">Quantity : {availableQuantity}</p> : ""
                            }
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
                  <label className="block mb-2 font-normal text-[#303F58] text-[14px]">
                    Add Notes
                  </label>
                  <textarea
                    name="notes"
                    value={orderDetails.notes}
                    onChange={updateOrder}
                    className="w-full p-2 border rounded-md text-[#000000] text-[14px] font-normal"
                    placeholder="Add a Note"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
                    Terms & Conditions
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={orderDetails.termsAndConditions}
                    onChange={updateOrder}
                    className="w-full p-2 border rounded-md text-[#000000] text-[14px] font-normal"
                    placeholder="Add Terms and Condition of Your Business"
                  ></textarea>
                  <div className="flex justify-end gap-10 mt-5">
                    <div>
                      <Link to={'/stockloaded'}>
                        <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
                          Cancel
                        </button>
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={handleSubmit}
                        className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStockloaded;
