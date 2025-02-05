// AddCoupon.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import back from "../../assets/images/backbutton.svg";

// Types
interface CouponForm {
  couponName: string;
  price: number;
  numberOfBottles: number;
}

const AddCoupon: React.FC = () => {
  const navigate = useNavigate();
  const { request: addCoupon } = useApi("post", 4000);

  const [formData, setFormData] = useState<CouponForm>({
    couponName: "",
    price: 0,
    numberOfBottles: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "numberOfBottles" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${endpoints.ADD_COUPON}`;
      const { response, error } = await addCoupon(url, formData);

      if (!error && response) {
        toast.success("Coupon added successfully.");
        setTimeout(() => navigate("/coupon"), 1000);
      } else {
        toast.error("Failed to add coupon.");
      }
    } catch (err) {
      console.error("Error saving coupon:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
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
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4">
        <button onClick={() => navigate("/coupon")}>
          <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
        </button>
        <h2 className="text-[20px] text-[#303F58] font-bold">Add Coupon</h2>
      </div>

      <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[#303F58] font-normal mb-1">
              Coupon Name
            </label>
            <input
              type="text"
              name="couponName"
              value={formData.couponName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price === 0 ? "" : formData.price} // If value is 0, show as empty string
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">
              Bottles
            </label>
            <input
              type="number"
              name="numberOfBottles"
              value={formData.numberOfBottles === 0 ? "" : formData.numberOfBottles} // If value is 0, show as empty string
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end mt-6 space-x-4 col-span-2">
            <button
              type="button"
              onClick={() => navigate("/coupon")}
              className="px-3 py-1 border-2 border-[#565148] rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#820000] text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
