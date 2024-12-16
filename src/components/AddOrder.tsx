import { Link, useNavigate } from "react-router-dom"
import backbutton from "../assets/images/nav-item.png";
// import plus from "../assets/images/Icons/circle-plus.svg";
// import minus from "../assets/images/Icons/circle-minus.svg";
import { useEffect, useState } from "react";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";
import Button from "../CommonComponents/Button";
import { toast, ToastContainer } from "react-toastify";

type Props = {}
interface Item {
    itemId: string;
    itemName: string;
    quantity: number;
    _id?: string;

}
interface OrdrerData {
    orderNumber: string,
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
    stock: Item[];
}

const AddOrder = ({ }: Props) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [ratePerCustomer, setRatePerCustomer] = useState("");
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState("");
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [orderData, setOrderData] = useState<OrdrerData>({
        orderNumber: "",
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
        stock: [],
    });


    console.log(orderData);
    console.log(orderData.stock[0]?.quantity, "qnt");

    const [activeRoute, setActiveRoute] = useState<any | null>(null);
    useEffect(() => {
        const RouteDetails = JSON.parse(localStorage.getItem("activeRoute") || "{}");
        setActiveRoute(RouteDetails);
    }, []);
    // Fetch localStorage data on mount
    useEffect(() => {
        // Only call getALLCustomers when activeRoute is set
        if (activeRoute) {
            getASubroute(),
                getALLCustomers();
        }
    }, [activeRoute]);

    console.log("route Dettails", activeRoute);

    const handleInputFocus = () => {
        // Show all customers when the input is focused
        setFilteredCustomers(customers);
    };
    const handleReturnBottleChange = (e: any) => {
        setOrderData((prev) => ({
            ...prev,
            returnBottle: Number(e.target.value) || 0, // Convert to number
        }));
    };


    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: any = Math.max(1, Number(e.target.value)); // Ensure quantity is at least 1
        if (value > quantity) {
            setError(`Only ${quantity} units are left in stock.`);
            return; // Exit the function to prevent updates
        }

        if (value === quantity) {
            setError("Warning: This item is now out of stock."); // Show warning for low quantities
        } else {
            setError(""); // Clear any previous warnings or errors
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
        // Perform calculation whenever stock or ratePerCustomer changes
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



    const handleItemClick = (itemId: string, itemName: string, mainRouteId: any, mainRouteName: any, subRouteName: any, quantity: any, _id: any,) => {

        setOrderData((prevState) => ({
            ...prevState,
            stock: [{ itemId, itemName, quantity: 1 }], // Use the quantity from the input
            mainRouteId: mainRouteId,
            mainRouteName: mainRouteName,
            subRouteName: subRouteName,
            subRouteId: _id,
        }));
        setQuantity(quantity)
        setSelectedItem({ itemId, itemName });
        setIsOpen(false); // Close dropdown on selection
    };
    console.log(quantity, "quantit");

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
            customer.fullName.toLowerCase().includes(value.toLowerCase())
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
        console.log(customers.ratePerBottle, "rate");

        setSearchValue(customers.fullName); // Set the selected customer's name in the input
        setFilteredCustomers([]); // Clear the dropdown
    };

    const [selectedItem, setSelectedItem] = useState<{ itemId: string; itemName: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false); // Control dropdown visibility



    const { request: getAllCustomers } = useApi("get", 4000);
    // Get All customer 

    const getALLCustomers = async () => {
        setLoading(true);
        try {
            const url = `${endpoints.GET_ALL_CUSTOMERS}`;
            const { response, error } = await getAllCustomers(url);

            if (!error && response) {
                const subRoute = activeRoute?.subRouteName;
                console.log(subRoute, "subRoute");

                // Filter customers based on subRoute
                const filteredCustomers = response.data.filter(
                    (customer: any) => customer.subRoute === subRoute
                );

                setCustomers(filteredCustomers);
                console.log(filteredCustomers, "filtered customers");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };



    const [subRoutes, setSubRoutes] = useState<any>({
        stock: [], // Initialize with an empty array to avoid undefined
    });

    const { request: getSubRoutes } = useApi("get", 4000)
    const id = activeRoute?.subRouteId;
    console.log(id);
    const getASubroute = async () => {
        try {
            const url = `${endpoints.VIEW_A_SUBROUTE}/${id}`
            const { response, error } = await getSubRoutes(url)

            if (!error && response) {
                setSubRoutes(response.data)
                console.log("API RESPONSE :", response.data)
            }
        } catch (error) {
            setError("An error occured")
            console.log(error)
        }
    }

    useEffect(() => {
        getASubroute(),
            getALLCustomers();

    }, [])

    // Set today's date when the component loads
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
        setOrderData((prevData) => ({ ...prevData, date: today }));
    }, []);

    const { request: AddOrder } = useApi("post", 4001);

    const handleSubmit = async () => {
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
            toast.error(error.data.message);
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
                        <label className="block text-gray-700">Search Customer</label>
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
                                filteredCustomers.map((customer: any) => (
                                    <div
                                        key={`${customer.customerID}-${customer.ratePerBottle}`}
                                        className="p-2 cursor-pointer m-2 border-2 rounded-lg hover:bg-gray-100"
                                        onClick={() => handleCustomerSelect(customer)}
                                    >
                                        {customer.fullName}
                                    </div>
                                ))
                            ) : (
                                <div className="p-2">No customers found</div>
                            )}
                        </div>
                    </div>


                    <div className="pt-2">
                        <label className="block text-gray-700">Order Number</label>
                        <input
                            type="text"
                            name="orderNumber"
                            value={orderData.orderNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Order Number"
                        />
                    </div>
                    <div className="pt-2 flex">
                        <div className="relative w-[75%] gap-2  mb-2"> {/* Ensure full width and margin for spacing */}
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
                                    {
                                        subRoutes.stock.map((item: any) => (
                                            <div
                                                key={item.itemId}
                                                onClick={() =>
                                                    handleItemClick(
                                                        item.itemId,
                                                        item.itemName,
                                                        subRoutes.mainRouteId,
                                                        subRoutes.mainRouteName,
                                                        subRoutes.subRouteName,
                                                        item.quantity,
                                                        subRoutes._id
                                                    )
                                                }
                                                className="p-2 m-2 border-2 rounded-lg text-left cursor-pointer hover:bg-gray-100"
                                            >
                                                {item.itemName}
                                            </div>
                                        ))

                                    }
                                </div>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div className=" items-center gap-2"> {/* Aligns the items horizontally */}
                            <label className="block text-gray-700">Quantity</label>
                            <input
                                type="number"
                                className="w-28 p-2 mt-1 ms-2 border rounded-md"
                                placeholder="01"
                                onChange={handleQuantityChange}
                                value={orderData.stock[0]?.quantity} // Display the quantity of the first item
                            />
                        </div>
                    </div>
                    {error && <div className="text-red-500 text-center text-sm mt-1">{error}</div>}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                            <label className="block text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={orderData.date}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded-md"
                                readOnly
                            />

                        </div>
                        <div>
                            <label className="block text-gray-700">Payment Mode</label>
                            <select
                                name="paymentMode"
                                className="w-full p-2 mt-1 border rounded-md"
                                value={orderData.paymentMode}
                                onChange={handleInputChange}
                            >
                                <option value="Cash">Cash</option>
                                <option value="Credit">Credit</option>
                                <option value="FOC">FOC</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="">
                            <label className="block text-gray-700">Main Route</label>
                            <input
                                type="text"
                                name="mainRouteName"
                                value={orderData.mainRouteName}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded-md"
                                placeholder="Enter email"
                                readOnly
                            />
                        </div>
                        <div className="">
                            <label className="block text-gray-700">Sub Route</label>
                            <input
                                type="text"
                                name="subRouteName"
                                value={orderData.subRouteName}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded-md"
                                placeholder="Enter email"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* salesman */}
                    <div className="pt-2">
                        <label className="block text-gray-700">Sales Man</label>
                        <input
                            type="text"
                            name="salesman"
                            value={activeRoute?.salesmanName}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Enter email"
                            readOnly
                        />
                    </div>

                    {/* Return  Empty Bottle */}
                    <div className="pt-2">
                        <label className="block text-gray-700">Return  Empty Bottle</label>
                        <input
                            type="number"
                            name="ReturnBottle"
                            value={orderData.returnBottle}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) { // Only allow numbers
                                    handleReturnBottleChange(e); // Update state if the input is valid
                                }
                            }}
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
                            placeholder="Return Empty Bottle"
                        />
                    </div>

                    {/* Rate per Item */}
                    <div className="pt-2">
                        <label className="block text-gray-700">Rate Per Item</label>
                        <input
                            type="number"
                            name="ratePerItem"
                            value={orderData.ratePerItem}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) { // Only allow numbers
                                    handleInputChange(e); // Update state if the input is valid
                                }
                            }}
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
                            placeholder="Rate Per Item"
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
                            placeholder="Enter Note"
                        />
                    </div>
                    <div className="pt-2">
                        <label className="block text-gray-700">Terms And Condition</label>
                        <input
                            type="text"
                            name="termsAndCondition"
                            value={orderData.termsAndCondition}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded-md"
                            placeholder="Terms And Condition"
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
                                placeholder="Total Amount"
                                readOnly
                            />
                        </div>
                    </div>
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