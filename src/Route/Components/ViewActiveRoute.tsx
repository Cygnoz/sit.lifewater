import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useParams } from "react-router-dom";
import car from "../../assets/images/car-front.png";
import user from "../../assets/images/user.png";
import user2 from "../../assets/images/user2.png";
import map from "../../assets/images/map-pinned.png";
import bottle from "../../assets/images/bottlesvg.svg";
import history from "../../assets/images/history.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
import { getActiveRouteByIdAPI } from "../../services/RouteAPI/ActiveRoute";

const ViewActiveRoute: React.FC = () => {
  const [routeData, setRouteData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("routeDetail");
  const [error, setError] = useState("");
  const { id } = useParams(); // Assumes route ID is passed as a URL parameter

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const data = await getActiveRouteByIdAPI(id as string);
        setRouteData(data);
        console.log(data);
        console.log(routeData);
      } catch (err: any) {
        setError(err.message || "Failed to load route data");
      }
    };

    fetchRouteData();
  }, [id]);

  return (
    <div className="px-6 py-3">
      {/* Back Button and Title */}
      <div className="flex gap-3 items-center w-full max-w-8xl mb-2 ">
        <Link to={"/route/activeroute"}>
          <div className="icon-placeholder">
            <img className="bg-[#ffff] rounded-full p-2" src={back} alt="" />
          </div>
        </Link>
        <h2 className="text-2xl font-bold">View Active Route</h2>
      </div>

      {/* Display route info cards if data is loaded */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B] rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={car} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Current Vehicle</div>
            <div className="text-lg text-white font-bold">
              {" "}
              {routeData?.route.vehicleNo || "N/A"}
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B]  rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={user} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Current Salesman</div>
            <div className="text-lg text-white font-bold">
              {" "}
              {routeData?.route.Salesman || "N/A"}
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B]  rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={map} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Current Sub Route</div>
            <div className="text-lg text-white font-bold">
              {routeData?.route.subRoute || "N/A"}
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B]  rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={bottle} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Bottle Stock</div>
            <div className="text-lg text-white font-bold">
              {routeData?.route.totalStock || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Error message display */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Buttons for navigating sections */}
      <div className="flex space-x-7 mb-4">
        <button
          className={`w-[221px] font-bold p-2 rounded-lg flex items-center ${
            activeSection === "routeDetail"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("routeDetail")}
        >
          <img src={user2} alt="" className="mr-2" />
          Route Detail
        </button>
        <button
          className={`w-[221px] p-2 font-bold rounded-lg flex items-center ${
            activeSection === "rideHistory"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("rideHistory")}
        >
          <img src={history} alt="" className="mr-2" />
          Ride History
        </button>

        <button
          className={`w-[221px] font-bold p-2 rounded-lg flex items-center ${
            activeSection === "currentStock"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("currentStock")}
        >
          <img src={dollar} alt="" className="mr-2" />
          Current Stock
        </button>
      </div>

      {/* Section Content */}
      {activeSection === "routeDetail" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Main Route</p>
              <p className="text-[#8F99A9]">{routeData?.route.mainRoute || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Sub Route</p>
              <p className="text-[#8F99A9]">{routeData?.route.subRoute || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Starting KM</p>
              <p className="text-[#8F99A9]">{routeData?.route.startingKm || "N/A"}</p>
            </div>

            <div>
              <p className="font-semibold">Driver</p>
              <p className="text-[#8F99A9]">{routeData?.route.driver || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Helper</p>
              <p className="text-[#8F99A9]">{routeData?.route.helper || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-[#8F99A9]">{routeData?.route.description || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "rideHistory" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="font-semibold">No Ride History </p>
        </div>
      )}

      {activeSection === "currentStock" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="font-semibold">No Current Stock </p>
        </div>
      )}
    </div>
  );
};

export default ViewActiveRoute;
