import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import back from "../../assets/images/backbutton.svg";
import settings from "../../assets/images/settings.svg";
import printer from "../../assets/images/printer.svg";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";

const AddReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { request: addReceipt } = useApi("post", 4001);
  const { request: getAllCustomers } = useApi("get", 4000);
  
  const [formData, setFormData] = useState({
    customer: "",
    type: "Purchase Payment",
    receiptNumber: "PAY 00002",
    receiptMethod: "",
    saleNumber: "",
    referenceNumber: "",
    receiptDate: "",
    account: "",
  });
  
  const [customers, setCustomers] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const url = `${endpoints}`;
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
    if (!formData.customer || !formData.receiptMethod || !formData.account) {
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
      const url = `${endpoints}`;
      const { response, error } = await addReceipt(url, formData);
      console.log(response);
      
      if (error) {
        toast.error(error.response?.data?.message || "Failed to save receipt");
      } else {
        toast.success("Receipt saved successfully.");
        setTimeout(() => navigate("/receipt"), 2000);
      }
    } catch (err: any) {
      console.error("Error saving receipt:", err);
      toast.error(err.message || "Failed to save receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-2'>
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4">
        <Link to={'/receipt'}>
          <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Receipts</h2>
      </div>
      <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Customer</label>
            <select name="customer" value={formData.customer} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.name}>{customer.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Type</label>
            <input type="text" value={formData.type} readOnly className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Receipt #</label>
            <div className="flex items-center border rounded-md">
              <input type="text" value={formData.receiptNumber} readOnly className="w-full px-3 py-2" />
              <img src={settings} alt="Settings Icon" className="w-5 h-5 px-2" />
            </div>
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Receipt Method</label>
            <select name="receiptMethod" value={formData.receiptMethod} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Account</label>
            <select name="account" value={formData.account} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Select Account</option>
            </select>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button type="button" className="px-3 py-1 bg-gray-200 border-2 border-gray-500 text-gray-600 rounded-md">
              <img src={printer} alt="Print" className="w-4 h-4 mr-2 inline" /> Print
            </button>
            <Link to={'/receipt'}>
              <button type="button" className="px-3 py-1 bg-gray-200 border-2 border-gray-500 text-gray-600 rounded-md">
                Cancel
              </button>
            </Link>
            <button type="submit" className="px-3 py-1 bg-[#820000] text-white rounded-md" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReceipt;
