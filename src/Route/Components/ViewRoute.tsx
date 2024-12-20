import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useParams, } from "react-router-dom";
import user2 from "../../assets/images/user2.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
import map1 from "../../assets/images/map-pin.svg";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";



const ViewRoute: React.FC = () => {
  const { id } = useParams();
  const [sData, setSData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>("routeDetail"); // Added state for active section

  const { request: getSubRoutes } = useApi("get", 4000);

  const getALLSubroute = async () => {
    try {
      const url = `${endpoints.GET_A_MAINROUTE}/${id}`;
      const { response, error } = await getSubRoutes(url);
      if (!error && response) {
        setSData(response.data?.data);
        console.log(response.data?.data);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLSubroute();
  }, []);

 

  return (
    <div className="p-2">
    <div className="flex justify-between gap-3 items-center w-full max-w-8xl mb-3 ">
      <div>
        <div className="icon-placeholder flex">
          <Link to={"/route/createroute"}>
            <img className="bg-white rounded-full p-2" src={back} alt="" />
          </Link>
          <h2 className="text-2xl font-bold ms-1">View Route</h2>
        </div>
      </div>
    </div>
  
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
          activeSection === "subRoute"
            ? "bg-[#E3E6D5] text-black"
            : "bg-white"
        }`}
        onClick={() => setActiveSection("subRoute")}
      >
        <img className="me-2" src={map1} alt="" /> Sub Route
      </button>
      <button
        className={`w-[221px] font-bold p-2  rounded-lg flex items-center ${
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
  
    {/* Conditional rendering based on the active section */}
    {activeSection === "routeDetail" && (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="font-semibold">Main Route</p>
            <p>{sData?.mainRouteName || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Main Route Code</p>
            <p>{sData?.routeCode || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p>{sData?.description || "No description provided"}</p>
          </div>
        </div>
      </div>
    )}
  
    {activeSection === "subRoute" && (
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead className=" bg-[#fdf8f0]">
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
              sData.subroutes.map((subroute :any, index:any) => (
                <tr className="border-b" key={subroute._id}>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {index + 1}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
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
          <thead className=" bg-[#fdf8f0]">
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
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Return Bottle
              </th>
            </tr>
          </thead>
          <tbody>
            {sData?.subroutes?.[0]?.stock?.length > 0 ? (
              sData.subroutes[0].stock.map((item  :any, index:any) => (
                <tr className="border-b" key={item.itemId}>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {index + 1}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {item.itemName || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {item.quantity || 0}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {item.returnBottle || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No Current Stock available
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
