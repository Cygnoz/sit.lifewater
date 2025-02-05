import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [formData, setFormData] = useState({
    date: "",
    customerId: "",
    orderId: "",
    orderNumber: "",
    paidAmount: "",
    depositAccountId: "",
    balanceAmount: "", // Added balanceAmount
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { response, error } = await getAllCustomers(
        endpoints.GET_ALL_CUSTOMERS
      );
      if (!error && response) setCustomers(response.data);
    };
    fetchCustomers();
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
        const filtered = response.data.filter(
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
      const customerOrders = orders.filter(
        (order) => order.customerId === value && order.balanceAmount > 0
      );
      setFilteredOrders(customerOrders);
      setFormData((prev) => ({
        ...prev,
        orderId: "",
        orderNumber: "",
        balanceAmount: "",
      })); // Reset selection
    }
  };

  const handleOrderSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrder = filteredOrders.find(
      (order) => order._id === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      orderId: selectedOrder?._id || "",
      orderNumber: selectedOrder?.orderNumber || "",
      balanceAmount: selectedOrder?.balanceAmount || "", // Set balance amount
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { response, error } = await addReceipt(
        endpoints.ORDER_RECIEPT,
        formData
      );
      console.log(response);

      if (error) {
        toast.error(error.response?.data?.message || "Failed to save receipt");
      } else {
        toast.success("Receipt saved successfully.");
        setTimeout(() => navigate("/collection"), 2000);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save receipt");
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

        <label className="block text-sm font-medium text-gray-700">
          Select Customer
        </label>
     
        <select
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
     
          <option value="">Select a customer</option>

          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.fullName}
            </option>
          ))}
        </select>

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
          value={`${formData.balanceAmount} AED `}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100"
          placeholder="Balance Amount"
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
        />

        <div>
          <label className="block text-gray-700">Deposit Account</label>
          <select
            name="depositAccountId"
            value={formData.depositAccountId}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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
