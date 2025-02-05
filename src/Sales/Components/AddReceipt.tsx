import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import back from "../../assets/images/backbutton.svg";

const AddReceipt: React.FC = () => {
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
      const { response, error } = await getAllCustomers(endpoints.GET_ALL_CUSTOMERS);
      if (!error && response) setCustomers(response.data);
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const { response, error } = await getALLOrders(endpoints.GET_ALL_ORDERS);
      if (!error && response) setOrders(response.data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { response, error } = await getAllAccounts(endpoints.GET_ALL_ACCOUNTS);
      if (!error && response) {
        const filtered = response.data.filter((account: any) => account.accountSubhead === "Cash");
        setFilteredAccounts(filtered);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (name === "customerId") {
      const customerOrders = orders.filter(
        (order) => order.customerId === value  && order.balanceAmount > 0
      );
      setFilteredOrders(customerOrders);
      setFormData((prev) => ({ ...prev, orderId: "", orderNumber: "", balanceAmount: "" })); // Reset selection
    }
  };

  const handleOrderSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrder = filteredOrders.find((order) => order._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      orderId: selectedOrder?._id || "",
      orderNumber: selectedOrder?.orderNumber || "",
      balanceAmount: selectedOrder?.balanceAmount || "", // Set balance amount
    }));
  };

  const validateForm = () => {
    if (!formData.date || !formData.customerId || !formData.orderId || !formData.paidAmount) {
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
      const { response, error } = await addReceipt(endpoints.ORDER_RECIEPT, formData);
console.log(response);

      if (error) {
        toast.error(error.response?.data?.message || "Failed to save receipt");
      } else {
        toast.success("Receipt saved successfully.");
        setTimeout(() => navigate("/reciept"), 2000);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white shadow-md rounded-lg mt-3">
      <button>
        <Link to={"/reciept"} className="mb-4">
          <div className="icon-placeholder">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
      </button>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <h2 className="text-xl font-bold text-gray-700 mb-4">Add Receipt</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-md" />
          <select name="customerId" value={formData.customerId} onChange={handleChange} className="w-full p-2 border rounded-md">
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="orderId" value={formData.orderId} onChange={handleOrderSelection} className="w-full p-2 border rounded-md">
            <option value="">Select Order</option>
            {filteredOrders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.orderNumber}
              </option>
            ))}
          </select>
          <input type="text" name="orderNumber" value={formData.orderNumber} readOnly className="w-full p-2 border rounded-md bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="balanceAmount" value={formData.balanceAmount} readOnly className="w-full p-2 border rounded-md bg-gray-100" placeholder="Balance Amount" />
          <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleChange} className="w-full p-2 border rounded-md placeholder:text-gray-600" placeholder="Collected Amount" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="depositAccountId" value={formData.depositAccountId} onChange={handleChange} className="w-full p-2 border rounded-md">
            <option value="">Select Account</option>
            {filteredAccounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.accountName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <Link to="/reciept" className="py-1 px-8 bg-gray-100 text-red-900 border border-red-900 rounded-lg hover:bg-gray-300">
            Cancel
          </Link>
          <button type="submit" className="py-1 px-8 bg-red-900 text-white rounded-lg" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReceipt;
