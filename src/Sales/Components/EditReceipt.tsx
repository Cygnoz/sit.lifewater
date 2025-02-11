import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import back from "../../assets/images/backbutton.svg";

const EditReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { request: editReceipt } = useApi("put", 4001);
  const { request: getReceipt } = useApi("get", 4001);
  const { request: getAllAccounts } = useApi("get", 4000);

  const [formData, setFormData] = useState({
    date: "",
    customerId: "",
    fullName: "",
    orderId: "",
    orderNumber: "",
    paidAmount: "",
    depositAccountId: "",
  });

  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
console.log(error);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const url = `${endpoints.VIEW_ONE_RECIEPT}/${id}`;
        const { response, error } = await getReceipt(url);
        if (error) {
          setError("Failed to load receipt details.");
          return;
        }
        const receiptData = response?.data?.data;
        setFormData({
          date: receiptData?.createdAt.split("T")[0] || "",
          customerId: receiptData?.customerId || "",
          fullName: receiptData?.fullName || "",
          orderId: receiptData?.orderId || "",
          orderNumber: receiptData?.orderNumber || "",
          paidAmount: receiptData?.paidAmount || "",
          depositAccountId: receiptData?.depositAccountId || "",
        });
      } catch (err) {
        setError("Something went wrong.");
      }
    };
    fetchReceipt();
  }, [id]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { response, error } = await getAllAccounts(endpoints.GET_ALL_ACCOUNTS);
      if (!error && response) {
        const filtered = response.data.filter((account: any) =>
          ["Cash", "Bank"].includes(account.accountSubhead)
        );
        setFilteredAccounts(filtered);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.date || !formData.paidAmount || !formData.depositAccountId) {
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
      const { response, error } = await editReceipt(  `${endpoints.EDIT_A_RECIEPT}/${id}`, formData);
      console.log(response, error);
      
      if (error) {
        toast.error(error.response?.data?.message || "Failed to save receipt");
      } else {
        toast.success("Receipt updated successfully.");
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
      <Link to="/reciept" className="mb-4">
        <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
      </Link>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />

      <h2 className="text-xl font-bold text-gray-700 mb-4">Edit Receipt</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          type="text"
          value={formData.fullName}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100"
        />

        <input
          type="text"
          value={formData.orderNumber}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100"
        />

        <input
          type="number"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="Collected Amount"
        />

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

        <div className="flex justify-between mt-4">
          <Link to="/reciept" className="py-1 px-8 bg-gray-100 text-red-900 border border-red-900 rounded-lg">
            Cancel
          </Link>
          <button
            type="submit"
            className="py-1 px-8 bg-red-900 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReceipt;
