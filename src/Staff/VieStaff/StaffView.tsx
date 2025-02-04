import { Link, useParams } from "react-router-dom";
import BackIcon from "../../assets/icons/BackIcon";
import { useContext, useEffect, useState } from "react";
import user from "../../assets/images/user staffview.svg";
import history from "../../assets/images/history.svg";

import PersionalDetails from "./PersionalDetails";
import OrderHistory from "./OrderHistory";
// import PaymentHistory from "./PaymentHistory";
// import Summary from "./Summary";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";
import { AnStaffResponseContext } from "../../Context/ContextShare";

type Props = {};

const StaffView = ({}: Props) => {
  const [activeTab, setActiveTab] = useState("personalDetails");

  const { setStaffResponse } = useContext(AnStaffResponseContext)!;
  const { id } = useParams();
  const { request: getStaff } = useApi("get", 4000);
  const [staffData, SetStaffData] = useState();
  // Fetch staff data for editing
  const getAnStaff = async () => {
    const url = `${endpoints.GET_AN_STAFF}/${id}`;
    try {
      const { response, error } = await getStaff(url);
      if (!error && response) {
        SetStaffData(response.data);
        setStaffResponse(response.data);
        console.log(staffData);
      }
      console.log(response?.data, "staffData");
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  useEffect(() => {
    getAnStaff();
  }, []);
  return (
    <div>
      <div className="flex mt-2">
        <Link to={"/staff"}>
          <BackIcon />
        </Link>
        <h3 className="text-[#303F58] mt-1 ms-3 text-[20px] font-bold">
          Staff Overview
        </h3>
      </div>
      {/* Tabs */}
      <div className="flex justify-start gap-5 w-ful mt-1 mx-auto mb-5 pt-2 h-[52px] ps-5 pe-5 bg-white shadow-md rounded-lg ">
        <button
          className={`flex px-9 py-2 h-[36px] rounded-lg text-center text-[14px] w-[221px] font-bold text-[#495160] ${
            activeTab === "personalDetails"
              ? "bg-[#E3E6D5] border-green-500"
              : ""
          }`}
          onClick={() => setActiveTab("personalDetails")}
        >
          <img className="me-1" src={user} alt="" />
          <h1>Personal Details</h1>
        </button>
        <button
          className={`flex px-10 py-2 h-[36px] rounded-lg text-center text-[14px] w-[221px] font-bold text-[#495160] ${
            activeTab === "orderHistory" ? "bg-[#E3E6D5] border-green-500" : ""
          }`}
          onClick={() => setActiveTab("orderHistory")}
        >
          <img className="me-1" src={history} alt="" />
          <h1>Order History</h1>
        </button>
      </div>
      <div>
        {activeTab === "personalDetails" && <PersionalDetails />}
        {activeTab === "orderHistory" && <OrderHistory />}
      </div>
    </div>
  );
};

export default StaffView;
