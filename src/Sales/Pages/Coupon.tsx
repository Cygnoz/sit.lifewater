// Coupon.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import plus from "../../assets/circle-plus.svg";
import PurchaseTable from "../../commoncomponents/Table/Table";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import { toast, ToastContainer } from "react-toastify";

const Coupon: React.FC = () => {
  const { request: deleteCoupon } = useApi("delete", 4000);
  const navigate = useNavigate(); // Initialize useNavigate
  const [coupons, setCoupons] = useState<any[]>([]);
  const { request: getCoupons } = useApi("get", 4000);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const url = `${endpoints.GET_ALL_COUPON}`;
        const { response, error } = await getCoupons(url);

        if (!error && response) {
          setCoupons(response.data);
          console.log(response.data);
        } else {
          console.error("Failed to fetch coupons:", error);
        }
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchCoupons();
  }, []);

  // Handle coupon deletion
  const handleDelete = async (couponId: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmation) return;

    try {
      const url = `${endpoints.DELETE_COUPON}/${couponId}`;
      const { response, error } = await deleteCoupon(url);

      if (!error && response) {
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon._id !== couponId)
        );
        toast.success("Coupon deleted successfully");
      } else {
        toast.error("Failed to delete coupon. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const columns = [
    { id: "updatedAt", label: "Date", visible: true },
    { id: "couponName", label: "Coupon Name", visible: true },
    { id: "numberOfBottles", label: "Total Bottle", visible: true },
    { id: "price", label: "Coupon Price", visible: true },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div>
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

      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Coupon</h3>
          <p className="text-[#4B5C79]">You can create a coupon here and sell from saleman </p>
        </div>
        <div>
          <Link to={"/addcoupon"}>
            <button className="flex items-center gap-2 bg-[#820000] text-white px-4 py-2 rounded-md">
              <img src={plus} alt="Add" />
              <p>Add New</p>
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
        <PurchaseTable
          columns={columns}
          data={coupons.map((coupon) => ({
            ...coupon,
            updatedAt: formatDate(coupon.updatedAt),
          }))}
          searchPlaceholder="Search Coupon"
          loading={false}
          searchableFields={["couponName", "price", "numberOfBottles"]}
          showAction={true}
          // onViewClick={(id) => console.log("View", id)}
          onEditClick={(id) => {
            // Navigate to EditCoupon page using the couponId in the URL
            navigate(`/editcoupon/${id}`);
          }}
          onDeleteClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default Coupon;
