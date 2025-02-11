import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import back from "../../assets/images/backbutton.svg";
import mappinned from "../../assets/images/map-pinned.svg";
import wtsp from "../../assets/images/whatsapp.svg";
import call from "../../assets/images/call.svg";
import mail from "../../assets/images/mail-check.svg";
import dot from "../../assets/images/threedot.svg";
import bottle from "../../assets/images/bottle.svg";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

const ViewCustmor: React.FC = () => {
  const { id } = useParams(); // Get the vehicle ID from the URL
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { request: getACustomer } = useApi("get", 4000);

  const getOneCustomer = async () => {
    try {
      const url = `${endpoints.GET_A_CUSTOMER}/${id}`;
      const { response, error } = await getACustomer(url);
      console.log(response);

      if (!error && response) {
        setLoading(false);
        setCustomer(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOneCustomer();
  }, []);

  if (loading) {
    return <div>Loading customer details...</div>; // Display a loading state while customer is being fetched
  }

  const defaultImage =
    "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png";

  // Calculate Due Amount
  // const calculateDueAmount = () => {
  //   if (customer) {
  //     const depositAmount = customer.depositAmount || 0;
  //     const numberOfBottles = customer.numberOfBottles || 0;
  //     const ratePerBottle = customer.ratePerBottle || 0;

  //     const dueAmount = depositAmount - (numberOfBottles * ratePerBottle);
  //     return dueAmount.toFixed(2); // Round to 2 decimal places
  //   }
  //   return "0.00"; // Default value if customer data is not available
  // };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header: View Customer Profile */}
      <div className="flex items-center space-x-2 mb-6">
        <button className="text-gray-600">
          <Link to={"/customer"}>
            <img
              className="bg-gray-200 rounded-full p-2"
              src={back}
              alt="Back"
            />
          </Link>
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          View Customer Profile
        </h1>
      </div>

      {/* Profile Picture and Vehicle Number */}
      <div className="bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] rounded-[8px] p-[16px_18px] flex justify-between items-center mb-6 w-full h-[92px]">
        {/* Left Side: Profile Picture and Name */}
        <div className="flex items-center space-x-[12px]">
          <img
            src={
              customer.customerType === "Business"
                ? customer.logo
                  ? `${customer.logo}`
                  : defaultImage
                : defaultImage
            }
            alt={customer.fullName}
            className="w-[45px] h-[45px] rounded-full object-cover"
          />

          <span className="text-[18px] font-bold text-gray-700">
            {customer?.customerType === "Business"
              ? customer.fullName || "N/A"
              : `${customer?.fullName || "N/A"}`}
          </span>
        </div>

        {/* Right Side: Placeholder for Icons */}
        <div className="flex items-center space-x-4">
          <div className="w-[20px] h-[20px]">
            <img src={wtsp} alt="" />
          </div>{" "}
          <div className="w-[20px] h-[20px]">
            <img src={call} alt="" />
          </div>{" "}
          <div className="w-[20px] h-[20px]">
            <img src={mail} alt="" />
          </div>{" "}
          <div className="w-[20px] h-[20px]">
            <img src={dot} alt="" />
          </div>{" "}
        </div>
      </div>

      {/* Conditional Rendering based on activeTab */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Cards */}
        <div className="md:col-span-1 space-y-[20px]">
          {/* Most Visited Route */}
          <div
            className="p-8 rounded-[24px] flex justify-between items-center w-[388px] mx-8 h-[123px]"
            style={{
              background:
                "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)",
            }}
          >
            <img src={mappinned} alt="Most Visited Route" />
            <div className="text-right">

              <p className="text-gray-900">{customer.city}</p>
              <h3 className="text-gray-900">
                <span >{customer.addressLine1}</span>
              </h3>
              <h3 className="text-gray-600">
                <span >{customer.addressLine2}</span>
              </h3>

            </div>
          </div>



          {/* License Validity */}
          <div
            className="p-8 rounded-[24px] flex justify-between items-center w-[388px] mx-8 h-[123px]"
            style={{
              background:
                "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)",
            }}
          >
            <img src={bottle} alt="License Validity" />
            <div className="text-right">
              {customer.stock && customer.stock.length > 0 ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Stock in Hand
                  </h2>
                  <p className="text-gray-600">
                    {customer.stock.map((item: any) => (
                      <div className="flex gap-2">
                        <p>{item.itemName}</p>
                        <p>: {item.quantity}</p>
                      </div>
                    ))}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Stock
                  </h2>
                  <p className="text-gray-600">No items in stock</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Stats */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6 mx-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border-2 rounded-lg bg-gradient-to-r  from-[#E3E6D5] to-[#F7E7CE]">
              <p className="text-gray-700">Payment Mode</p>
              <h2 className="text-xl font-bold text-gray-800"> {customer?.paymentMode}</h2>
            </div>

            <div className="text-center p-4 border-2 rounded-lg bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE]">
              <p className="text-gray-700">DEPOSIT AMOUNT</p>
              <h2 className="text-xl font-bold text-gray-800">{customer?.depositAmount} AED</h2>
            </div>
          </div>

          {/* General and Other Details */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* General Details */}
            <div className="bg-gray-5 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-700 mb-4">
                {
                  customer?.CouponBottle &&
                  <p className="text-gray-700 text-[13px]">Balance Coupon : {customer?.CouponBottle}</p>
                }         General Details
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-gray-500 text-lg text-[14px]">
                  Email
                </p>
                <p className="font-bold text-gray-700 text-[14px]">
                  {customer.email || "N/A"}{" "}
                </p>

                <p className="font-bold text-gray-500 text-lg text-[14px]">
                  Mobile
                </p>
                <p className="text-gray-700">{customer.mobileNo || "N/A"}</p>

                <p className="font-bold text-gray-500 text-lg text-[14px]">
                  WhatsApp Number
                </p>
                <p className="text-gray-700">
                  {customer.whatsappNumber || "N/A"}
                </p>
              </div>
            </div>

            {/* Other Details */}
            <div className="bg-gray-5 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-700 mb-4">
                Other Details
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-gray-500 text-lg text-[14px]">
                  Customer Type
                </p>
                <p className="text-gray-700">{customer.customerType}</p>

                <p className="font-bold text-gray-500 text-lg text-[14px]">
                  Payment Mode
                </p>
                <p className="text-gray-700">{customer.paymentMode || "N/A"}</p>

                <p className="font-bold text-gray-500 text-lg text-[14px]">
                  Joined Date
                </p>
                <p className="text-gray-700">
                  {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustmor;