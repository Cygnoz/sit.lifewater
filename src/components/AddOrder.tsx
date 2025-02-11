import { Link, useNavigate, useParams } from "react-router-dom";
import backbutton from "../assets/images/nav-item.png";
import plus from "../assets/images/Icons/circle-plus.svg";
import minus from "../assets/images/Icons/circle-minus.svg";
import { useEffect, useState } from "react";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";
// import Button from "../CommonComponents/Button";
import { toast, ToastContainer } from "react-toastify";
import user from "../assets/images/Icons/user-round-plus.svg";
import { format } from "date-fns";
type Props = {};
interface Item {
    itemId: string;
    itemName: string;
    quantity: number;
    _id?: string;
}
interface OrdrerData {
    mainRouteName: string;
    mainRouteId: string;
    subRouteName: string;
    subRouteId: string;
    customerId: string;
    salesman: string;
    date: string;
    paymentMode: string;
    notes: string;
    totalAmount: number;
    returnBottle: number;
    ratePerItem: string;
    rideId: string;
    stock: Item[];
    depositAccountId: string;
    paidAmount: number;
}

const AddOrder = ({ }: Props) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [ratePerCustomer, setRatePerCustomer] = useState("");
    const [error, setError] = useState("");
    const [paidAmounterror, setPaidAmountError] = useState("");
    const [quantity, setQuantity] = useState(Number);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [couponCount, setCouponCount] = useState(Number);

    const [selectedItem, setSelectedItem] = useState<{
        itemId: string;
        itemName: string;
        status: string;
        sellingPrice: number;
    } | null>(null);
    const [isOpen, setIsOpen] = useState(false); // Control dropdown visibility
    const [subRoutes, setSubRoutes] = useState<any>({
        stock: [], // Initialize with an empty array to avoid undefined
    });
    const [orderData, setOrderData] = useState<OrdrerData>({
        mainRouteName: "",
        mainRouteId: "",
        subRouteName: "",
        subRouteId: "",
        customerId: "",
        salesman: "",
        date: "",
        paymentMode: "",
        notes: "",
        totalAmount: 0, // Initialized as a number
        returnBottle: 0, // Initialized as a number
        ratePerItem: "", // Initialized as a number
        rideId: "",
        stock: [],
        depositAccountId: "",
        paidAmount: 0,
    });
    console.log("Input Data", orderData);
    const { editId } = useParams();

    const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
    // fetch a order for editing
    const { request: getAOrder } = useApi("get", 4001);
    const getOrder = async () => {
        if (!editId) return; // Ensure editId is available

        setLoading(true);
        try {
            const url = `${endpoints.VIEW_A_ORDER}/${editId}`;
            const { response, error } = await getAOrder(url);
            if (!error && response) {
                console.log("One Order RESPONSE:", response?.data);
                setOrderData({
                    mainRouteName: response?.data.mainRouteName || "",
                    mainRouteId: response?.data.mainRouteId || "",
                    subRouteName: response?.data.subRouteName || "",
                    subRouteId: response?.data.subRouteId || "",
                    customerId: response?.data.customerId || "",
                    salesman: response?.data.salesman || "",
                    date: response?.data.date || "",
                    paymentMode: response?.data.paymentMode || "",
                    notes: response?.data.notes || "",
                    totalAmount: response?.data.totalAmount || 0,
                    returnBottle: response?.data.returnBottle || 0,
                    ratePerItem: response?.data.ratePerItem || "",
                    rideId: response?.data.rideId || "",
                    stock: response?.data.stock || [],
                    depositAccountId: response?.data.depositAccountId || "",
                    paidAmount: response?.data.paidAmount || 0,
                });
                setSearchValue(response?.data.customerName || ""); // Set customer name
                setRatePerCustomer(response?.data.ratePerItem || ""); // Set rate per item

                // Set the selected item if available
                if (response.data.stock?.length > 0) {
                    const selected = response.data.stock[0]; // Assuming single item
                    setSelectedItem({
                        itemId: selected.itemId,
                        itemName: selected.itemName,
                        status: selected.status,
                        sellingPrice: selected.ratePerItem,
                    });
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch order details when editId is available
    useEffect(() => {
        if (editId) {
            getOrder();
        }
    }, [editId]); // Runs whenever editId changes

    // Fetch activeroute with sales id
    const { request: getActiveRoute } = useApi("get", 4000);
    const SalesManId = localStorage.getItem("SalesManId");
    const fetchActiveRoute = async () => {
        try {
            const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
            const { response, error } = await getActiveRoute(url);
            console.log("Active route with sales id:", response?.data?.activeRide);

            if (!error && response) {
                setLoading(false);
                const activeRide = response?.data?.activeRide;

                if (activeRide) {
                    setOrderData((prevData) => ({
                        ...prevData,
                        rideId: activeRide._id,
                        mainRouteId: activeRide.mainRouteId,
                        mainRouteName: activeRide.mainRouteName,
                        subRouteId: activeRide.subRouteId,
                        subRouteName: activeRide.subRouteName,
                        salesman: activeRide.salesmanName,
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (orderData?.subRouteName) {
            getALLCustomersBySubRoute(orderData.subRouteName);
        }
    }, [orderData?.subRouteName]);

    // Fetch accounts from the API
    const { request: getallaccounts } = useApi("get", 4000);
    const fetchAccounts = async () => {
        try {
            const url = `${endpoints.GET_ALL_ACCOUNTS}`;
            const { response, error } = await getallaccounts(url);
            // console.log("API RESPONSE :", response);

            if (!error && response) {
                setLoading(false);
                // console.log(loading);
                const formattedData = response.data;
                const filtered = formattedData.filter((account: any) =>
                    ["Cash", "Bank"].includes(account.accountSubhead)
                );
                setFilteredAccounts(filtered);
                console.log("filteredAccounts", filtered);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchAccounts();
        fetchActiveRoute();
    }, []);
    const handleDepositeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setOrderData((prevData) => ({
            ...prevData,
            depositAccountId: value,
        }));
    };
    useEffect(() => {
        if (orderData.paymentMode !== "Cash") {
            setOrderData((prevData) => ({
                ...prevData,
                depositAccountId: "",
                paidAmount: 0,
            }));
        }
    }, [orderData.paymentMode]);

    // Paid Amount change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Ensure only numbers are entered
        if (!/^\d*\.?\d*$/.test(value)) return;
        const numericValue = value === "" ? 0 : parseFloat(value); // Ensure numeric type

        // Check if entered amount is greater than totalAmount
        if (!isNaN(numericValue) && numericValue > (orderData.totalAmount || 0)) {
            setPaidAmountError(
                "Paid amount cannot be greater than the total amount."
            );
            return; // Do not update state if greater than totalAmount
        } else {
            setPaidAmountError(""); // Clear error if valid
        }
        setOrderData((prevData) => ({
            ...prevData,
            paidAmount: numericValue, // Ensuring it's always a number
        }));
    };
  

    const handleInputFocus = () => {
        // Show all customers when the input is focused
        setFilteredCustomers(customers);
    };

    const handleReturnBottleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Convert value to a number or set to 0 if empty
        const numericValue = value === "" ? 0 : Number(value);
        setOrderData((prev) => ({
            ...prev,
            returnBottle: numericValue,
        }));
    };

    const incrementQuantity = () => {
        handleQuantityChange(orderData.stock[0]?.quantity + 1);
    };

    const decrementQuantity = () => {
        handleQuantityChange(orderData.stock[0]?.quantity - 1);
    };

    const handleQuantityChange = (value: number) => {
        if (value < 1) return; // Prevent quantity from going below 1
        if (value > quantity) {
            setError(`Only ${quantity} units are left in stock.`);
            return;
        }
        if (value === quantity) {
            setError("Warning: This item is now out of stock.");
        } else {
            setError("");
        }

        setOrderData((prevState) => {
            // Update the quantity of the selected item
            const updatedItems = prevState.stock.map((item) =>
                item.itemId === selectedItem?.itemId
                    ? { ...item, quantity: value }
                    : item
            );
            return { ...prevState, stock: updatedItems }; // Update stock only, calculation will occur in useEffect
        });
    };

    useEffect(() => {
        const ratePerBottle: any = orderData.ratePerItem || 0;

        const newTotalAmount: any = orderData.stock.reduce(
            (total, item) => total + item.quantity * ratePerBottle,
            0
        );

        setOrderData((prevState) => ({
            ...prevState,
            totalAmount: newTotalAmount.toString(),
        }));
    }, [orderData.stock, orderData.ratePerItem]); // Dependencies to trigger recalculation

    const handleItemClick = (
        itemId: any,
        itemName: any,
        quantity: any,
        status: any,
        sellingPrice: any
    ) => {
        setOrderData((prevState) => ({
            ...prevState,
            stock: [{ itemId, itemName, quantity: 1 }], // Use the quantity from the input
        }));
        setQuantity(quantity || 0);
        setSelectedItem({ itemId, itemName, status, sellingPrice });
        setIsOpen(false); // Close dropdown on selection
    };
    // console.log(quantity, "quantit");
    // console.log(selectedItem, "selectedItem");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Update specific field in orderData
        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (!value.trim()) {
            setFilteredCustomers(customers);
            return;
        }
        const filtered = customers.filter((customer: any) => {
            return (
                customer?.fullName?.toLowerCase().includes(value.toLowerCase()) ||
                customer?.customerID?.toLowerCase().includes(value.toLowerCase()) ||
                customer?.city?.toLowerCase().includes(value.toLowerCase()) ||
                customer?.mobileNo?.toString().includes(value) || // Convert number to string
                customer?.whatsappNumber?.toString().includes(value)|| // Convert number to string
                customer?.addressLine1?.toString().includes(value) // Convert number to string
            );
        });

        setFilteredCustomers(filtered);
    };

    const handleCustomerSelect = (customers: any) => {
        // Handle customer selection (e.g., update order data)
        setOrderData((prevData) => ({
            ...prevData,
            customerId: customers._id,
            ratePerItem: customers.ratePerBottle || "",
            paymentMode: customers?.paymentMode || "",
        }));
        setCouponCount(customers?.CouponBottle || "")
        setRatePerCustomer(customers?.ratePerBottle);
        setSearchValue(customers.fullName); // Set the selected customer's name in the input
        setFilteredCustomers([]); // Clear the dropdown
    };

    const { request: getAllCustomers } = useApi("get", 4000);
    // Get All customer in the subroute
    const getALLCustomersBySubRoute = async (subRoute: any) => {
        if (!subRoute) return; // Prevent API call if subRoute is undefined

        setLoading(true);
        try {
            const url = `${endpoints.GET_CUSTOMER_BY_SUBROUTE}/${subRoute}`;
            const { response, error } = await getAllCustomers(url);
            console.log("Get all customer in SubRoute", response);

            if (!error && response) {
                setCustomers(response?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // gat a sub route
    const { request: getSubRoutes } = useApi("get", 4000);
    const id = orderData?.subRouteId;
    const getASubroute = async () => {
        if (!id) return; // Prevent API call if id is undefined

        try {
            const url = `${endpoints.VIEW_A_SUBROUTE}/${id}`;
            const { response, error } = await getSubRoutes(url);

            if (!error && response) {
                setSubRoutes(response.data);
                console.log("SubRoute Response:", response.data);
            }
        } catch (error) {
            setError("An error occurred");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Run API call only when `orderData?.subRouteId` is available
    useEffect(() => {
        if (id) {
            getASubroute();
        }
    }, [id]);

    useEffect(() => {
        const now = new Date();
        const formattedDateTime = format(now, "yyyy-MM-dd HH:mm:ss"); // Format: YYYY-MM-DD HH:MM:SS
        setOrderData((prevData) => ({ ...prevData, date: formattedDateTime }));
    }, []);

    const { request: AddOrder } = useApi("post", 4001);
    const { request: EditOrder } = useApi("put", 4001);

    //     if (!orderData.customerId) {
    //         toast.error("Select a customer.");
    //         return;
    //     }

    //     if (orderData.stock.length === 0) {
    //         toast.error("Add at least one stock item.");
    //         return;
    //     }
    //     if (!orderData.paymentMode) {
    //         toast.error("Select a payment mode.");
    //         return;
    //     }
    //     if (orderData.paymentMode === "Cash") {
    //         if (!orderData.depositAccountId) {
    //             toast.error("Select a Deposite Account.");
    //             return;
    //         }
    //     }
    //     try {
    //         const orderWithDefaults = {
    //             ...orderData,
    //             stock: orderData.stock.map(item => ({
    //                 ...item,
    //             })),
    //         };
    //         const url = editId ?
    //             `${endpoints.ADD_ORDER}` :
    //             `${endpoints.EDIT_ORDER}/${editId}`;
    //         const { response, error } = await AddOrder(url, orderWithDefaults)
    //         if (!error && response) {
    //             console.log('Order', response);
    //             toast.success(response?.data.message);
    //             setTimeout(() => {
    //                 navigate("/orders")
    //             }, 1000)
    //         }
    //         console.log(error);
    //     } catch (error: any) {
    //         console.error(error);
    //         toast.error(error?.response?.data?.message || error?.message || "Failed to save order");
    //     }
    // };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple clicks
        setIsSubmitting(true);
        if (!orderData.customerId) {
            toast.error("Select a customer.");
            return;
        }

        if (orderData.stock.length === 0) {
            toast.error("Add at least one stock item.");
            return;
        }

        if (!orderData.paymentMode) {
            toast.error("Select a payment mode.");
            return;
        }

        if (orderData.paymentMode === "Cash" && !orderData.depositAccountId) {
            toast.error("Select a Deposit Account.");
            return;
        }

        const url = editId
            ? `${endpoints.EDIT_ORDER}/${editId}`
            : `${endpoints.ADD_ORDER}`;

        try {
            const orderWithDefaults = {
                ...orderData,
                stock: orderData.stock.map((item) => ({
                    ...item,
                })),
            };
            const { response, error } = editId
                ? await EditOrder(url, orderWithDefaults)
                : await AddOrder(url, orderWithDefaults);

            if (!error && response) {
                toast.success(response.data.message);

                if (!editId) {
                    setOrderData({
                        mainRouteName: "",
                        mainRouteId: "",
                        subRouteName: "",
                        subRouteId: "",
                        customerId: "",
                        salesman: "",
                        date: "",
                        paymentMode: "",
                        notes: "",
                        totalAmount: 0, // Initialized as a number
                        returnBottle: 0, // Initialized as a number
                        ratePerItem: "", // Initialized as a number
                        rideId: "",
                        stock: [],
                        depositAccountId: "",
                        paidAmount: 0,
                    });
                }
                setTimeout(() => {
                    navigate("/orders"); // Navigate to orders page after 1 second
                }, 1000);
            } else {
                toast.error(error?.response?.data?.message || "An error occurred");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error("Error submitting order data:", error);
        }
    };

    return (
        <div className="py-3 px-2 bg-[#FFFFFF] shadow-md rounded-lg">
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
            <div className="flex items-center mb-4">
                <Link to="/orders">
                    <button className="w-10 rounded-full flex items-center justify-center">
                        <img src={backbutton} alt="Back" className="w-full h-full" />
                    </button>
                </Link>
                <h2 className="text-lg font-semibold text-center ms-[25%]">
                    {editId ? <div>Edit Order</div> : <div>New Order</div>}
                </h2>
            </div>
            <form className="space-y-4">
                <div className="px-5">
                    <div className="relative">
                        <label className="block text-gray-700">Select Customer</label>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={handleInputFocus}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Search Customer"
                        />
                        {/* Dropdown for customer suggestions */}
                        <div className="absolute z-10 w-full bg-white mt-1 max-h-52 overflow-auto rounded shadow-lg">
                            {loading ? (
                                <div className="p-2 text-gray-500">Loading...</div>
                            ) : customers.length > 0 ? (
                                <div>
                                    {filteredCustomers.map((customer: any) => (
                                        <div
                                            key={`${customer.customerID}-${customer.ratePerBottle}`}
                                            onClick={() => handleCustomerSelect(customer)}
                                        >
                                            <div className="p-2 cursor-pointer m-2 border-2 rounded-lg hover:bg-gray-100">
                                                {customer.fullName}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2">No customers found in this sub route</div>
                            )}
                        </div>
                        <Link to={"/addcustomers"}>
                            <div className="flex gap-1 my-1 cursor-pointer">
                                <img src={user} alt="" />
                                <p className="text-[#820000] text-[14px] font-semibold">
                                    Add New Customer
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="pt-2 flex">
                        <div className="relative w-[70%] gap-2  mb-2">
                            {" "}
                            {/* Ensure full width and margin for spacing */}
                            {/* Selected Item Display */}
                            <label className="block text-gray-700">Select Item</label>
                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full p-2 bg-white border mt-1 border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                            >
                                {selectedItem ? selectedItem.itemName : "Select an item"}
                            </div>
                            {/* Dropdown List */}
                            {isOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {loading ? (
                                        <p className="p-2 text-center">Loading...</p>
                                    ) : error ? (
                                        <p className="p-2 text-center text-red-500">{error}</p>
                                    ) : subRoutes?.stock?.length > 0 ? (
                                        subRoutes?.stock?.map((item: any) => (
                                            <div
                                                key={item.itemId}
                                                onClick={() =>
                                                    handleItemClick(
                                                        item.itemId,
                                                        item.itemName,
                                                        item.quantity,
                                                        item.status,
                                                        item.sellingPrice
                                                    )
                                                }
                                                className="p-2 m-2 border-2 rounded-lg text-left cursor-pointer hover:bg-gray-100"
                                            >
                                                {item.itemName}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-2 text-center">No items available</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div className="items-center gap-2">
                            {" "}
                            {/* Aligns the items horizontally */}
                            <label className="block text-gray-700">Quantity</label>
                            <div className="flex mx-1">
                                <button
                                    type="button" // Prevent form submission
                                    onClick={decrementQuantity}
                                >
                                    <img src={minus} alt="" />
                                </button>

                                <input
                                    type="number"
                                    className="w-10 p-2 mt-1 mx-1 border rounded-md text-center"
                                    placeholder="01"
                                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                    min={1}
                                    value={orderData.stock[0]?.quantity} // Display the quantity of the first item
                                />

                                <button
                                    type="button" // Prevent form submission
                                    onClick={incrementQuantity}
                                >
                                    <img src={plus} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {quantity ? (
                        <div className="text-[13px] ms-1">Quantity : {quantity}</div>
                    ) : (
                        ""
                    )}
                    {error && (
                        <div className="text-red-500 text-center text-sm mt-1">{error}</div>
                    )}
                    <div className="flex  pt-2">
                        <div className="w-full">
                            <label className="block text-gray-700">Payment Mode</label>
                            <select
                                name="paymentMode"
                                className="w-full p-2 mt-1 border rounded-md"
                                value={orderData.paymentMode}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Payment Mode</option>
                                <option value="Cash">Cash</option>
                                <option value="Credit">Credit</option>
                                <option value="Coupon">Coupon</option>
                            </select>
                        </div>
                    </div>
                    {couponCount ?
                        <p className="text-[#8c8c8c] text-[13px] pt-1"> Balance Coupon : {couponCount}</p>
                        : ""
                    }
                    {orderData.paymentMode === "Cash" && (
                        <div className="flex pt-2">
                            <div className="w-full">
                                <label className="block text-gray-700">Deposit Account</label>
                                <select
                                    name="depositAccount"
                                    className="w-full p-2 mt-1 border rounded-md"
                                    value={orderData.depositAccountId}
                                    onChange={handleDepositeChange} // Pass function reference
                                    required
                                >
                                    <option value="">Select Account</option>
                                    {Array.isArray(filteredAccounts) &&
                                        filteredAccounts.length > 0 ? (
                                        filteredAccounts.map((account: any) => (
                                            <option key={account._id} value={account._id}>
                                                {account.accountName}
                                            </option>
                                        ))
                                    ) : (
                                        <option>No accounts available</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    )}
                    {/* Rate per Item */}
                    <div className="pt-2">
                        <label className="block text-gray-700">Rate Per Item</label>
                        <input
                            type="text" // Change to "text" to handle decimals
                            name="ratePerItem"
                            value={orderData.ratePerItem}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow numbers and at most one decimal point
                                if (/^\d*\.?\d*$/.test(value)) {
                                    handleInputChange(e); // Update state if the input is valid
                                }
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "e" || // Prevent 'e' for exponential notation
                                    e.key === "+" || // Prevent '+'
                                    e.key === "-" || // Prevent '-'
                                    e.key === " " // Prevent space
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Enter Rate"
                        />
                    </div>
                    {/* Return  Empty Bottle */}
                    <div className="pt-2">
                        <label className="block text-gray-700">Return Empty Bottle</label>
                        <input
                            type="number"
                            name="returnBottle"
                            value={orderData.returnBottle || ""} // Use `|| ''` to handle undefined
                            onChange={handleReturnBottleChange} // Call directly to handle input change
                            onKeyDown={(e) => {
                                if (
                                    e.key === "e" || // Prevent 'e' for exponential notation
                                    e.key === "+" || // Prevent '+'
                                    e.key === "-" || // Prevent '-'
                                    e.key === "." || // Prevent '.'
                                    e.key === " " // Prevent space
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Empty Return Bottle Number"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="block text-gray-700">Note</label>
                        <input
                            type="text"
                            name="notes"
                            value={orderData.notes}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Add Note"
                        />
                    </div>

                    <div>
                        {/* Other component UI */}
                        <div className="pt-2">
                            <label className="block text-gray-700">Total Amount</label>
                            <input
                                type="text"
                                name="totalAmount"
                                value={
                                    orderData.totalAmount
                                        ? orderData.totalAmount
                                        : ratePerCustomer
                                }
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded-md"
                                readOnly
                            />
                        </div>
                    </div>
                    {orderData.paymentMode === "Cash" && (
                        <div className="pt-2">
                            <label className="block text-gray-700">Paid Amount</label>
                            <input
                                type="text"
                                name="paidAmount"
                                value={orderData.paidAmount}
                                onChange={handleAmountChange}
                                className="w-full p-2 mt-1 border rounded-md"
                                placeholder="Enter Paid Amount"
                            />
                            {paidAmounterror && (
                                <div className="text-red-500 text-center text-sm mt-1">
                                    {paidAmounterror}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-center items-center mt-3">
                        <button
                            className="bg-red-900 text-white px-10 py-2 w-full rounded-lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddOrder;
