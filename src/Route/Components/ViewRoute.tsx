import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useParams } from "react-router-dom";
import user2 from "../../assets/images/user2.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
import map1 from "../../assets/images/map-pin.svg";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";
import history from "../../assets/images/history.png";

const ViewRoute: React.FC = () => {
  const { id } = useParams();
  const [sData, setSData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>("routeDetail");

  const { request: getSubRoutes } = useApi("get", 4000);

  const getALLSubroute = async () => {
    try {
      const url = `${endpoints.GET_A_MAINROUTE}/${id}`;
      const { response, error } = await getSubRoutes(url);
      if (!error && response) {
        setSData(response.data?.data);
        console.log("Response: ", response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLSubroute();
  }, []);

  const { request: getALLRIDE } = useApi("get", 4000);
  const [rides, setRides] = useState<any[]>([]);

  const getALLRides = async () => {
    try {
      const url = `${endpoints.GET_RIDE_HISTORY}/${id}`;
      const { response, error } = await getALLRIDE(url);

      if (!error && response) {
        const mappedData = response.data?.data.map((ride: any) => ({
          _id: ride._id,
          createdAt: ride.createdAt,
          salesmanName: ride.salesmanName,
          driverName: ride.driverName,
          vehicleNumber: ride.vehicleNumber,
          mainRouteName: ride.mainRouteName,
          stock: ride.stock,
          travelledKM: ride.travelledKM,
        }));
        setRides(mappedData);
        console.log("API :", mappedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getALLRides();
  }, []);

  return (
    <div className="p-2">
      <div className="flex justify-between gap-3 items-center w-full max-w-8xl mb-3">
        <div>
          <div className="icon-placeholder flex">
            <Link to={"/route/createroute"}>
              <img
                className="bg-white rounded-full p-2"
                src={back}
                alt="Back"
              />
            </Link>
            <h2 className="text-2xl font-bold ms-1">View Route</h2>
          </div>
        </div>
      </div>

      <div className="flex space-x-7 mb-4">
        {["routeDetail", "subRoute", "currentStock", "ridehistory"].map(
          (section) => (
            <button
              key={section}
              className={`w-[221px] font-bold p-2 rounded-lg flex items-center ${
                activeSection === section
                  ? "bg-[#E3E6D5] text-black"
                  : "bg-white"
              }`}
              onClick={() => setActiveSection(section)}
            >
              <img
                src={
                  section === "routeDetail"
                    ? user2
                    : section === "subRoute"
                    ? map1
                    : section === "currentStock"
                    ? dollar
                    : section === "ridehistory"
                    ? history
                    : ""
                }
                alt=""
                className="mr-2"
              />
              {section === "routeDetail" && "Route Detail"}
              {section === "subRoute" && "Sub Route"}
              {section === "currentStock" && "Current Stock"}
              {section === "ridehistory" && "Ride History"}
            </button>
          )
        )}
      </div>

      {activeSection === "routeDetail" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Main Route</p>
              <p>{sData?.mainRoute?.mainRouteName || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Main Route Code</p>
              <p>{sData?.mainRoute?.mainRouteCode || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p>
                {sData?.mainRoute?.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "subRoute" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-[#fdf8f0]">
              <tr className="border-b">
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sl No
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sub Route
                </th>
              </tr>
            </thead>
            <tbody>
              {sData?.subroutes?.length > 0 ? (
                sData.subroutes.map((subroute: any, index: number) => (
                  <tr className="border-b" key={subroute._id}>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {index + 1}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {subroute.subRouteName || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center p-4 text-gray-500">
                    No sub-routes available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "currentStock" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-[#fdf8f0]">
              <tr className="border-b">
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sl No
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Item Name
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {sData?.subroutes?.[0]?.stock?.length > 0 ? (
                sData.subroutes[0].stock.map((item: any, index: number) => (
                  <tr className="border-b" key={item.itemId}>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {index + 1}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {item.itemName || "N/A"}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {item.quantity || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No current stock available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "ridehistory" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-[#fdf8f0]">
              <tr className="border-b">
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sl No
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Salesman Name
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Driver Name
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Vehicle Number
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Main Route Name
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Travelled KM
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Stock Details
                </th>
              </tr>
            </thead>
            <tbody>
              {rides.length > 0 ? (
                rides.map((ride, index) => (
                  <tr className="border-b" key={ride._id}>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {index + 1}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {ride.salesmanName || "N/A"}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {ride.driverName || "N/A"}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {ride.vehicleNumber || "N/A"}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {ride.mainRouteName || "N/A"}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {ride.travelledKM || 0}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {ride.stock && ride.stock.length > 0 ? (
                        <table className="w-full bg-[#fdf8f0] rounded-lg text-left">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-[12px] text-center text-[#303F58]">
                                Item Name
                              </th>
                              <th className="p-2 text-[12px] text-center text-[#303F58]">
                                Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {ride.stock.map((item: any) => (
                              <tr key={item.itemId} className="border-b">
                                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                                  {item.itemName || "N/A"}
                                </td>
                                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                                  {item.quantity || 0} pcs
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        "No Stock"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No ride history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRoute;
