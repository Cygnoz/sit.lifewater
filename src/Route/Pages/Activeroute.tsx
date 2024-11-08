import React, { useEffect, useState } from "react";
import printer from "../../assets/images/printer.svg";
import split from "../../assets/images/list-filter.svg";
import search from "../../assets/images/search.svg";
import eye from "../../assets/images/eye.svg";

import {  useNavigate } from "react-router-dom";
import { getActiveRouteAPI } from "../../services/RouteAPI/ActiveRoute";

const ActiveRoute: React.FC = () => {
  const [activeRoutes, setActiveRoutes] = useState<any[]>([]); // Add a type assertion for clarity
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state

  const navigate = useNavigate();
  useEffect(() => {
    const fetchActiveRoutes = async () => {
      try {
        const response = await getActiveRouteAPI();

        // Ensure the data is an array, or handle it accordingly
        const routes = Array.isArray(response.data) ? response.data : [];
        setActiveRoutes(routes); // Store the fetched data in state
        console.log(routes);
      } catch (error) {
        console.error("Failed to fetch active routes:", error);
      }
    };

    fetchActiveRoutes();
  }, []);

  

  const handleView = (routeId: string): void => {
    navigate(`/route/viewactiveroute/${routeId}`);
  };


   // Filter activeRoutes based on searchTerm
   const filteredRoutes = activeRoutes.filter((route) => {
    const searchText = searchTerm.toLowerCase();
    return (
      route?.Salesman?.toLowerCase().includes(searchText) ||
      route?.helper?.toLowerCase().includes(searchText)
    );
  });
  return (
    <div className="">
      
      <div className=" my-2 mx-2">
              <h3 className="text-[#303F58] text-[20px] font-bold">
              Active Route
              </h3>
              <p className="text-[#4B5C79]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
            </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full flex items-center">
            <div className="absolute left-2">
              <img src={search} alt="search" className="h-5 w-5" />
            </div>
            <input
              className="pl-9 text-sm w-full rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.04)",
                outline: "none",
                boxShadow: "none",
              }}
              placeholder="Search Route"
              value={searchTerm} // Bind search input to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
           
            />
          </div>
          <div className="flex w-[60%] justify-end">
            <button className="flex border text-[14px] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
              <img src={split} className="mt-1 me-1" alt="" />
              Sort By
            </button>
            <button className="flex border text-[14px] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
              <img src={printer} className="mt-1 me-1" alt="" />
              Print
            </button>
          </div>
        </div>

        {/* Loading and Error Handling */}

        <table className="w-full text-left">
          <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
              <th scope="col" className="px-6 py-3">
                <input type="checkbox" />
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Sl No
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Main Route
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Sub Route
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Sales Man
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Helper
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Vehicle Number
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Total Stock
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Sold Stock
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route, index) => (
                <tr className="border-b" key={route.id}>
                  <td className="px-6 py-4">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {index + 1}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.mainRoute}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.subRoute}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.Salesman}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.helper}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.vehicleNo}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.totalStock}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.soldStock}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    <button
                      onClick={() => handleView(route._id)}
                      className="text-blue-500"
                    >
                      <img src={eye} alt="View" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4 text-gray-500">
                  No active routes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRoute;
