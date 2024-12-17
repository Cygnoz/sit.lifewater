import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useParams } from "react-router-dom";
import user2 from "../../assets/images/user2.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

const ViewActiveRoute: React.FC = () => {
  const [routeData, setRouteData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("routeDetail");
  const [error, setError] = useState("");
  const { id } = useParams(); // Assumes route ID is passed as a URL parameter
  const { request: getActiveRoutes } = useApi("get", 4000);

  const getAnActiveroute = async () => {
    try {
      const url = `${endpoints.GET_AN_ACTIVE_ROUTE}/${id}`;
      console.log(id);

      const { response, error } = await getActiveRoutes(url);
      console.log("API RESPONSE :", response?.data.data);

      if (!error && response) {
        setRouteData(response?.data.data);
      }
    } catch (error) {
      setError("An error occured");
      console.log(error);
    }
  };

  useEffect(() => {
    getAnActiveroute();
  }, []);

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
              <p className="text-[#8F99A9]">
                {routeData?.mainRouteName || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Sub Route</p>
              <p className="text-[#8F99A9]">
                {routeData?.subRouteName || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Starting KM</p>
              <p className="text-[#8F99A9]">{routeData?.startingKm || "N/A"}</p>
            </div>

            <div>
              <p className="font-semibold">Driver</p>
              <p className="text-[#8F99A9]">{routeData?.driverName || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Helper</p>
              <p className="text-[#8F99A9]">{routeData?.helperName || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Sales Man</p>
              <p className="text-[#8F99A9]">{routeData?.salesmanName || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Vehicle No</p>
              <p className="text-[#8F99A9]">{routeData?.vehicleNumber || "N/A"}</p>
            </div>
           
          </div>
        </div>
      )}

  

      {activeSection === "currentStock" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Current Stock</h3>
          {routeData?.stock?.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {routeData.stock.map((item :any, index:any) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-[#fdf8f0] rounded"
                >
                  <span className="font-medium">{item.itemName}</span>
                  <span className="font-medium text-gray-500">
                    Quantity: {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No Current Stock</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewActiveRoute;
