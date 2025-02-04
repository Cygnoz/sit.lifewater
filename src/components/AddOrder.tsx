import { Link, useNavigate } from "react-router-dom"
import backbutton from "../assets/images/nav-item.png";
import plus from "../assets/images/Icons/circle-plus.svg";
import minus from "../assets/images/Icons/circle-minus.svg";
import { useEffect, useState } from "react";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";
import Button from "../CommonComponents/Button";
import { toast, ToastContainer } from "react-toastify";
import user from '../assets/images/Icons/user-round-plus.svg'
import { format } from 'date-fns';
type Props = {}
interface Item {
    itemId: string;
    itemName: string;
    quantity: number;
    _id?: string;
}
interface OrdrerData {
    // orderNumber: string,
    mainRouteName: string,
    mainRouteId: string,
    subRouteName: string,
    subRouteId: string,
    customerId: string,
    salesman: string,
    date: string,
    paymentMode: string,
    notes: string,
    termsAndCondition: string,
    totalAmount: number,
    returnBottle: number,
    ratePerItem: string,
    rideId: string,
    stock: Item[];
    depositAccountId: string
    paidAmount: number
}

const AddOrder = ({ }: Props) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [ratePerCustomer, setRatePerCustomer] = useState("");
    const [error, setError] = useState("");
    const [paidAmounterror, setPaidAmountError] = useState("");
    const [quantity, setQuantity] = useState(Number);
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<{ itemId: string; itemName: string, status: string, sellingPrice: number } | null>(null);
    const [isOpen, setIsOpen] = useState(false); // Control dropdown visibility
    const [subRoutes, setSubRoutes] = useState<any>({
        stock: [], // Initialize with an empty array to avoid undefined
    });
    const [orderData, setOrderData] = useState<OrdrerData>({
        // orderNumber: "",
        mainRouteName: "",
        mainRouteId: "",
        subRouteName: "",
        subRouteId: "",
        customerId: "",
        salesman: "",
        date: "",
        paymentMode: "",
        notes: "",
        termsAndCondition: "",
        totalAmount: 0, // Initialized as a number
        returnBottle: 0, // Initialized as a number
        ratePerItem: "", // Initialized as a number
        rideId: "",
        stock: [],
        depositAccountId: "",
        paidAmount: 0
    });
    console.log("Input Data", orderData);

    const [filteredAccounts, setFilteredAccounts] = useState<any>(""); // All accounts

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
                const filtered = response.data.filter(
                    (account: any) => ["Cash", "Bank"].includes(account.accountSubhead)
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
            setPaidAmountError("Paid amount cannot be greater than the total amount.");
            return; // Do not update state if greater than totalAmount
        } else {
            setPaidAmountError(""); // Clear error if valid
        }
        setOrderData((prevData) => ({
            ...prevData,
            paidAmount: numericValue, // Ensuring it's always a number
        }));
    };
    // Ensure paidAmount is automatically set to totalAmount when available
    useEffect(() => {
        if (orderData.totalAmount) {
            setOrderData((prevData) => ({
                ...prevData,
                paidAmount: prevData.totalAmount, // Auto-fill paidAmount
            }));
        }
    }, [orderData.totalAmount]);

    const handleInputFocus = () => {
        // Show all customers when the input is focused
        setFilteredCustomers(customers);
    };


    const handleReturnBottleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Convert value to a number or set to 0 if empty
        const numericValue = value === '' ? 0 : Number(value);
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
            const updatedItems = prevState.stock.map(item =>
                item.itemId === selectedItem?.itemId ? { ...item, quantity: value } : item
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

    const handleItemClick = (itemId: any, itemName: any, quantity: any, status: any, sellingPrice: any) => {

        setOrderData((prevState) => ({
            ...prevState,
            stock: [{ itemId, itemName, quantity: 1 }], // Use the quantity from the input          
        }));
        setQuantity(quantity)
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

        // Filter customers based on the search input
        const filtered = customers.filter((customer: any) =>
            customer.fullName.toLowerCase().includes(value.toLowerCase()) ||
            customer.customerID.toLowerCase().includes(value.toLowerCase()) ||
            customer.city.toLowerCase().includes(value.toLowerCase()) ||
            customer.mobileNo.toString().includes(searchValue) || // Convert to string for matching
            customer.whatsappNumber.toString().includes(searchValue)
        );
        setFilteredCustomers(filtered);
    };

    const handleCustomerSelect = (customers: any) => {
        // Handle customer selection (e.g., update order data)
        setOrderData((prevData) => ({
            ...prevData,
            customerId: customers._id,
            ratePerItem: customers.ratePerBottle || "",
        }));
        //
        setRatePerCustomer(customers.ratePerBottle)
        setSearchValue(customers.fullName); // Set the selected customer's name in the input
        setFilteredCustomers([]); // Clear the dropdown
    };

    const { request: getAllCustomers } = useApi("get", 4000);
    // Get All customer 
    const getALLCustomersBySubRoute = async (subRoute: any) => {
        if (!subRoute) return; // Prevent API call if subRoute is undefined

        setLoading(true);
        try {
            const url = `${endpoints.GET_CUSTOMER_BY_SUBROUTE}/${subRoute}`;
            const { response, error } = await getAllCustomers(url);
            console.log("Get All customer SubRoute", response);

            if (!error && response) {
                setCustomers(response?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const { request: getSubRoutes } = useApi("get", 4000)
    const id = orderData?.subRouteId;
    // console.log(id);
    const getASubroute = async () => {
        if (!id) return;  // Prevent API call if id is undefined

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
        const formattedDateTime = format(now, 'yyyy-MM-dd HH:mm:ss'); // Format: YYYY-MM-DD HH:MM:SS
        setOrderData((prevData) => ({ ...prevData, date: formattedDateTime }));
    }, []);


    const { request: AddOrder } = useApi("post", 4001);

    const handleSubmit = async () => {
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
        if (orderData.paymentMode === "Cash") {
            if (!orderData.depositAccountId) {
                toast.error("Select a Deposite Account.");
                return;
            }
        }
        try {
            const orderWithDefaults = {
                ...orderData,
                stock: orderData.stock.map(item => ({
                    ...item,
                })),
            };
            const url = `${endpoints.ADD_ORDER}`;
            const { response, error } = await AddOrder(url, orderWithDefaults)
            if (!error && response) {
                console.log('Order', response);
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/orders")
                }, 1000)
            }
            console.log(error);
            toast.error(error.response.data.message);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data.message);
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
                    New Order
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
                                    {
                                        filteredCustomers.map((customer: any) => (
                                            <div
                                                key={`${customer.customerID}-${customer.ratePerBottle}`}
                                                onClick={() => handleCustomerSelect(customer)}
                                            >
                                                <div className="p-2 cursor-pointer m-2 border-2 rounded-lg hover:bg-gray-100"                                        >
                                                    {customer.fullName}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                            ) :
                                (
                                    <div className="p-2">No customers found</div>
                                )}
                        </div>
                        <Link to={'/addcustomers'}>
                            <div className="flex gap-1 my-1 cursor-pointer">
                                <img src={user} alt="" />
                                <p className="text-[#820000] text-[14px] font-semibold">Add New Customer</p>
                            </div>
                        </Link>
                    </div>
                    <div className="pt-2 flex">
                        <div className="relative w-[70%] gap-2  mb-2"> {/* Ensure full width and margin for spacing */}
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
                                        subRoutes?.stock?.map((item:any) => (
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
                        <div className="items-center gap-2"> {/* Aligns the items horizontally */}
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
                    {quantity ?
                        <div className="text-[13px] ms-1">
                            Quantity : {quantity}
                        </div> : ""
                    }
                    {error && <div className="text-red-500 text-center text-sm mt-1">{error}</div>}
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
                                <option value="FOC">FOC</option>
                            </select>
                        </div>
                    </div>
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
                                    {filteredAccounts.map((account: any) => (
                                        <option key={account._id} value={account._id}>
                                            {account.accountName}
                                        </option>
                                    ))}
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
                                    e.key === " "    // Prevent space
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
                        <label className="block text-gray-700">Return  Empty Bottle</label>
                        <input
                            type="number"
                            name="returnBottle"
                            value={orderData.returnBottle || ''} // Use `|| ''` to handle undefined
                            onChange={handleReturnBottleChange} // Call directly to handle input change
                            onKeyDown={(e) => {
                                if (
                                    e.key === "e" || // Prevent 'e' for exponential notation
                                    e.key === "+" || // Prevent '+'
                                    e.key === "-" || // Prevent '-'
                                    e.key === "." || // Prevent '.'
                                    e.key === " "    // Prevent space
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
                                value={orderData.totalAmount ? orderData.totalAmount : ratePerCustomer}
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
                            {paidAmounterror && <div className="text-red-500 text-center text-sm mt-1">{paidAmounterror}</div>}
                        </div>
                    )}

                    <div className=" py-3 ">
                        <Button size="xl" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddOrder