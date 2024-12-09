import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import list from "../../assets/images/list-todo.svg"
import history from "../../assets/images/history.svg"
import BackIcon from "../../assets/icons/BackIcon"
import InformationStatus from "./Information/InformationStatus"
import RideHistory from "./RideHistory"
import useApi from "../../Hook/UseApi"
import { endpoints } from "../../services/ApiEndpoint"
import vehicle from "../../assets/images/vehicledemo.jpg"
import { AnVehicleResponseContext } from "../../Context/ContextShare"

const ViewVehicle: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"information" | "rideHistory">("information")
  const [vehicleData, setVehicleData] = useState<any>(null) // Changed to any for flexibility
  const { id } = useParams() // Get the staff ID from the URL
  const { setVehicleResponse } = useContext(AnVehicleResponseContext)!;
  const { request: getVehicle } = useApi("get", 4000);

  const getAnVehicle = async () => {
    const url = `${endpoints.VIEW_AN_VEHICLE}/${id}`;
    try {
      const { response, error } = await getVehicle(url);
      if (!error && response) {
        setVehicleData(response.data.vehicle);
        setVehicleResponse(response.data.vehicle);
        console.log(response.data.vehicle, "an vehicle");

      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    getAnVehicle();

  }, []); // if (!vehicle) return <div>Loading...</div> // Loading state
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <button className="text-gray-600">
          <Link to={"/vehicle"}>
            <BackIcon />
          </Link>
        </button>
        <h1 className="text-xl font-bold text-gray-800">View Customer Profile</h1>
      </div>

      <div className="bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] rounded-[8px] p-[16px_18px] flex items-center space-x-[24px] mb-6  h-[92px]">
        <img
          src={vehicleData?.image ? vehicleData.image : vehicle}
          alt="Vehicle"
          className="w-16 h-16 rounded-full flex"
        />        
        <p className="text-[18px] font-bold text-gray-700 leading-[21.78px] text-left font-inter"> {vehicleData?.vehicleNo || "NA"}
        </p>
      </div>

      <div className="bg-[#FFFFFD] shadow-md rounded-[8px] p-[8px_16px] flex justify-center items-center gap-[6px] mb-6 h-[52px]">
        <button className={`flex-3 flex items-center justify-center py-2 rounded-md font-medium space-x-2 px-6 ${activeTab === "information" ? "bg-gray-200" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("information")}>
          <img src={list} alt="Information" />
          <span className="text-gray-700">Information</span>
        </button>
        <button className={`flex-1 flex items-center justify-start py-2 rounded-md font-medium space-x-2 px-6 ${activeTab === "rideHistory" ? "bg-gray-200" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("rideHistory")}>
          <img src={history} alt="Ride History" />
          <span className="text-gray-700">Ride History</span>
        </button>
      </div>

      {/* Row 4: Content - Conditional Rendering based on activeTab */}
      {activeTab === "information" ? (
        <div>
          <InformationStatus />

        </div>
      ) : (
        <div>
          <RideHistory />
        </div>
      )}
    </div>
  )
}

export default ViewVehicle
