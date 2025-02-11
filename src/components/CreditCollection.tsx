import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";

const CreditCollection: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { request: addReceipt } = useApi("post", 4001);
  const { request: getAllCustomers } = useApi("get", 4000);
  const { request: getALLOrders } = useApi("get", 4001);
  const { request: getAllAccounts } = useApi("get", 4000);
  const SalesManId = localStorage.getItem("SalesManId");
  const [activeSubRoute, setActiveSubRoute] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    orderId: "",
    orderNumber: "",
    paidAmount: 0,
    depositAccountId: "",
    salesmanId: SalesManId
  });
  const [  balanceAmount, setBalanceAmount] = useState("");

  console.log("formData", formData);

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);




  // Fetch activeroute with sales id
  const { request: getActiveRoute } = useApi("get", 4000);
  const fetchActiveRoute = async () => {
    try {
      const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
      const { response, error } = await getActiveRoute(url);
      console.log("Active route with sales id:", response?.data?.activeRide);

      if (!error && response) {
        setLoading(false);
        const activeRide = response?.data?.activeRide;

        if (activeRide) {

          setActiveSubRoute(activeRide.subRouteName)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (activeSubRoute) {
      getALLCustomersBySubRoute(activeSubRoute);
    };

  }, [activeSubRoute]);

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


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setFilteredCustomers(customers); // Reset if input is empty
      return;
    }
    const filtered = customers.filter((customer: any) => {
      return (
        customer?.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        customer?.customerID?.toLowerCase().includes(value.toLowerCase()) ||
        customer?.city?.toLowerCase().includes(value.toLowerCase()) ||
        customer?.mobileNo?.toString().includes(value) || // Convert number to string
        customer?.whatsappNumber?.toString().includes(value) // Convert number to string
      );
    });

    setFilteredCustomers(filtered);
  };

  const handleInputFocus = () => {
    // Show all customers when the input is focused
    setFilteredCustomers(customers);
  };

  const handleCustomerSelect = (customers: any) => {
    // Handle customer selection (e.g., update order data)
    setFormData((prevData) => ({
      ...prevData,
      customerId: customers?._id,
    }));
    //
    setSearchValue(customers.fullName); // Set the selected customer's name in the input
    setFilteredCustomers([]); // Clear the dropdown
  };

  







  useEffect(() => {
    fetchActiveRoute();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const { response, error } = await getALLOrders(endpoints.GET_ALL_ORDER);
      if (!error && response) setOrders(response.data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { response, error } = await getAllAccounts(
        endpoints.GET_ALL_ACCOUNTS
      );
      if (!error && response) {
        const formattedData = response.data;

        const filtered = formattedData?.filter(
          (account: any) => account.accountSubhead === "Cash"
        );
        setFilteredAccounts(filtered);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (name === "customerId") {
      setFormData((prev) => ({
        ...prev,
        orderId: "",
        orderNumber: "",
        balanceAmount: 0,
      })); // Reset selection
    }
  };

  useEffect(() => {
    if (formData.customerId) {
      const customerOrders = orders.filter(
        (order) => order.customerId === formData.customerId && order.balanceAmount > 0
      );
      setFilteredOrders(customerOrders);
    }
  }, [formData.customerId, orders]);

  const handleOrderSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrder = filteredOrders.find(
      (order) => order._id === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      orderId: selectedOrder?._id || "",
      orderNumber: selectedOrder?.orderNumber || "",
    }));
    setBalanceAmount(selectedOrder?.balanceAmount || "")
  };


  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  console.log(error);

  const { request: getReceipt } = useApi("get", 4001);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        if (!id) return; // Ensure id exists before fetching

        const url = `${endpoints.VIEW_ONE_RECIEPT}/${id}`;
        const { response, error } = await getReceipt(url);

        if (!error && response) {
          const Data = response?.data?.data
          console.log("response", Data);

          setFormData((prev) => ({
            ...prev,
            date: Data?.updatedAt || "",
            customerId: Data?.customerId || "",
            orderId: Data?.orderId || "",
            orderNumber: Data?.orderNumber || "",
            paidAmount: Data?.paidAmount || 0,
            depositAccountId: Data?.depositAccountId || "",
            salesmanId: Data?.salesmanId || SalesManId, // Default to existing SalesManId
          }));
          setBalanceAmount(Data.balanceAmount || 0)
        }
      } catch (err) {
        setError("Something went wrong.");
      }
    };

    fetchReceipt();
  }, [id]);


  const validateForm = () => {
    if (
      !formData.date ||
      !formData.customerId ||
      !formData.orderId ||
      !formData.paidAmount
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };
  const { request: EditOrder } = useApi("put", 4001);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Ensure form validation before proceeding

    setLoading(true);

    try {
      const url = id
        ? `${endpoints.EDIT_A_RECIEPT}/${id}`
        : `${endpoints.ORDER_RECIEPT}`;

      let response, error;

      if (id) {
        ({ response, error } = await EditOrder(url, formData));
      } else {
        ({ response, error } = await addReceipt(url, formData));
      }
      console.log("Handle response", response);

      if (error) {
        toast.error(error?.response?.data?.message || "Failed to save receipt");
      } else {
        toast.success("Receipt saved successfully.");
        setTimeout(() => navigate("/collection"), 2000);
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to save receipt");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-5">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

         {/* Search for customer */}
         <div className="relative">
              <label className="block text-[#484A4D] font-semibold text-left mb-2">Select Customer</label>
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
            </div>

        <label className="block text-sm font-medium text-gray-700">
          Select Order
        </label>
        <select
          name="orderId"
          value={formData.orderId}
          onChange={handleOrderSelection}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select an order</option>
          {filteredOrders.map((order) => (
            <option key={order._id} value={order._id}>
              {order.orderNumber} - {order.customerName}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700">
          Order Number
        </label>
        <input
          type="text"
          name="orderNumber"
          value={formData.orderNumber}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100"
        />
        <label className="block text-sm font-medium text-gray-700">
          Amount to Pay
        </label>
        <input
          type="text"
          name="balanceAmount"
          value={`${balanceAmount} AED `}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100"
        />

        <label className="block text-sm font-medium text-gray-700">
          Collected Amount
        </label>
        <input
          type="number"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="Enter Amount"

        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Deposit Account</label>
          <select
            name="depositAccountId"
            value={formData.depositAccountId}
            onChange={handleChange}
            className="w-full p-2 mt-3 border rounded-md"
          >
            <option value="">Select Account</option>
            {filteredAccounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.accountName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-5">
          <Link
            to="/collection"
            className="py-1 px-8 bg-gray-100 text-red-900 border border-red-900 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="py-1 px-8 bg-red-900 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCollection;
