import React, { useEffect, useState } from "react";
import printer from "../../assets/images/printer.svg";
import search from "../../assets/images/search.svg";
import Eye from "../../assets/icons/Eye";
import { useNavigate } from "react-router-dom";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import SortByActivRoute from "../Components/SortByActivRoute";

const ActiveRoute: React.FC = () => {
  const [activeRoutes, setActiveRoutes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Number of items per page
  const [sortKey, setSortKey] = useState<string>(""); // Sort key
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Sort order

  const navigate = useNavigate();
  const { request: getAllActiveRoute } = useApi("get", 4000);

  // Fetch Active Routes
  const getALLActiveroute = async () => {
    try {
      const url = `${endpoints.GET_ALL_ACTIVE_ROUTE}`;
      const { response, error } = await getAllActiveRoute(url);

      if (!error && response) {
        const routesArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setActiveRoutes(routesArray);
        console.log("Active Routes:", routesArray);
      } else {
        setActiveRoutes([]);
      }
    } catch (error) {
      console.error("Error fetching active routes:", error);
      setActiveRoutes([]);
    }
  };

  useEffect(() => {
    getALLActiveroute();
  }, []);

  const handleView = (routeId: string): void => {
    navigate(`/route/viewactiveroute/${routeId}`);
  };

  // Sort and filter data
  const sortedRoutes = [...activeRoutes]
    .filter((route) =>
      searchTerm
        ? [
          route?.driverName,
          route?.helperName,
          route?.mainRouteName,
          route?.salesmanName,
          route?.subRouteName,
          route?.vehicleNumber,
        ]
          .map((field) => field?.toLowerCase() || "")
          .some((fieldValue) => fieldValue.includes(searchTerm.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      if (!sortKey) return 0; // Skip sorting if no key
      const aValue = a[sortKey]?.toString().toLowerCase() || "";
      const bValue = b[sortKey]?.toString().toLowerCase() || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = sortedRoutes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedRoutes.length / itemsPerPage));

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="my-4 mx-4">
      <div className="my-2 mx-2">
        <h3 className="text-[#303F58] text-[20px] font-bold">Active Route</h3>
        <p className="text-[#4B5C79]">
          Manage active routes and view details.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Search and Sort */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full flex items-center">
            <div className="absolute left-2">
              <img src={search} alt="search" className="h-5 w-5" />
            </div>
            <input
              className="pl-9 text-sm w-full rounded-md text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              placeholder="Search by active route"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-[60%] justify-end gap-4">
            <SortByActivRoute
              onSortChange={(key, order) => {
                setSortKey(key);
                setSortOrder(order);
              }}
            />
            <button className=" hidden border text-[14px] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
              <img src={printer} className="mt-1 me-1" alt="Print" />
              Print
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sales Man</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Main Route</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sub Route</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Driver</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Vehicle No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Total items</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRoutes.length > 0 ? (
              currentRoutes.map((route, index) => (
                <tr className="border-b cursor-pointer hover:bg-[#F9F7F0]" key={route._id}   onClick={() => handleView(route._id)} >
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.salesmanName || "N/A"}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.mainRouteName || "N/A"}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.subRouteName || "N/A"}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.driverName || "N/A"}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.vehicleNumber || "N/A"}
                  </td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    {route.stock?.length}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleView(route._id)}
                      className="text-blue-500"
                    >
                      <Eye color={"#569FBC"} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  No active routes available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-red-800 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-red-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveRoute;
