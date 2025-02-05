// EditCoupon.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditCoupon: React.FC = () => {
  const { id } = useParams(); // Get couponId from URL parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CouponForm>({
    couponName: "",
    price: 0,
    numberOfBottles: 0,
  });
  const [loading, setLoading] = useState(false);

  const { request: viewACoupon } = useApi("get", 4000);
  const { request: updateCoupon } = useApi("put", 4000);

  // Fetch coupon data if editing an existing coupon
  useEffect(() => {
    if (id) {
      const fetchCoupon = async () => {
        try {
          const url = `${endpoints.VIEW_A_COUPON}/${id}`;
          const { response, error } = await viewACoupon(url);

          if (!error && response) {
            setFormData({
              couponName: response.data.couponName,
              price: response.data.price,
              numberOfBottles: response.data.numberOfBottles,
            });
          } else {
            toast.error("Failed to fetch coupon data.");
          }
        } catch (err) {
          console.error("Error fetching coupon data:", err);
          toast.error("An error occurred while fetching coupon data.");
        }
      };
      fetchCoupon();
    }
  }, [id]); // This ensures the effect runs only when couponId changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "numberOfBottles" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${endpoints.EDIT_COUPON}/${id}`;
      const { response, error } = await updateCoupon(url, formData);

      if (!error && response) {
        toast.success("Coupon updated successfully.");
        setTimeout(() => navigate("/coupon"), 1000);
      } else {
        toast.error("Failed to update coupon.");
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
        <h2 className="text-[20px] text-[#303F58] font-bold">Edit Coupon</h2>
      </div>

      <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Coupon Name</label>
            <input
              type="text"
              name="couponName"
              value={formData.couponName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Bottles</label>
            <input
              type="number"
              name="numberOfBottles"
              value={formData.numberOfBottles}
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
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoupon;
