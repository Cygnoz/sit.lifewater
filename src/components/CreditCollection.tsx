import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";

const CreditCollection: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { request: Addpaymentcollection } = useApi("post", 4001);
  const { request: getAllCustomers } = useApi("get", 4000);

  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    invoiceNumber: "",
    collectAmount: "",
  });

  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const url = `${endpoints.GET_ALL_CUSTOMERS}`;
        const { response, error } = await getAllCustomers(url);
        if (!error && response) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.date || !formData.customer || !formData.invoiceNumber || !formData.collectAmount) {
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
      const payload = { ...formData };
      const url = `${endpoints}`;
      const { response, error } = await Addpaymentcollection(url, payload);
      console.log(response);
      
      if (error) {
        toast.error(error.response?.data?.message || "Failed to save");
      } else {
        toast.success("Payment collected successfully.");
        setTimeout(() => {
          navigate("/viewcustomers");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error adding customer:", err);
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-5">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Customer</label>
          <select
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.customerID} value={customer.fullName}>
                {customer.fullName}
              </option>
            ))}
          </select>
          <Link to="/addcustomers">
            <div className="flex gap-1 my-1 cursor-pointer">
              <p className="text-[#820000] text-[14px] font-semibold">Add New Customer</p>
            </div>
          </Link>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Collect Amount</label>
          <input
            type="number"
            name="collectAmount"
            value={formData.collectAmount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-between mt-5">
          <Link to="/collection">
            <button className="py-1 px-8 bg-gray-200 text-red-600 border border-red-500 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </Link>
          <button type="submit" className="py-1 px-8 bg-red-600 text-white rounded-lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCollection;