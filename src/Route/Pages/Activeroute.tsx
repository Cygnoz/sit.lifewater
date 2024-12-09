import React, { useEffect, useState } from "react";
import printer from "../../assets/images/printer.svg";
import search from "../../assets/images/search.svg";
import eye from "../../assets/images/eye.svg";
import { useNavigate } from "react-router-dom";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import SortByActivRoute from "../Components/SortByActivRoute";

const ActiveRoute: React.FC = () => {
  const [activeRoutes, setActiveRoutes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Number of items per page
  const [sortKey, setSortKey] = useState<string>(""); // Current sort key
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Current sort order

  const navigate = useNavigate();
  const { request: getAllActiveRoute } = useApi("get", 4000);

  const getALLActiveroute = async () => {
    try {
      const url = `${endpoints.GET_ALL_ACTIVE_ROUTE}`;
      const { response, error } = await getAllActiveRoute(url);

      if (!error && response) {
        const routesArray = Array.isArray(response.data.data) ? response.data.data : [];
        setActiveRoutes(routesArray);
      } else {
        setActiveRoutes([]);
      }
    } catch (error) {
      console.error(error);
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
     route?.driver?.toLowerCase().includes(searchTerm.toLowerCase())
   )
   .sort((a, b) => {
     if (!sortKey) return 0; // Skip sorting if no key
     const aValue = a[sortKey]?.toString().toLowerCase();
     const bValue = b[sortKey]?.toString().toLowerCase();
     if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
     if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
     return 0;
   });
   
 // Pagination logic
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentRoutes = sortedRoutes.slice(indexOfFirstItem, indexOfLastItem);
 const totalPages = Math.ceil(sortedRoutes.length / itemsPerPage);



 const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
 const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);


  return (
    <div className="">
      <div className="my-2 mx-2">
        <h3 className="text-[#303F58] text-[20px] font-bold">Active Route</h3>
        <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur.</p>
      </div>

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
            <button className="flex border text-[14px] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
              <img src={printer} className="mt-1 me-1" alt="" />
              Print
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Main Route</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sub Route</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Driver</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Helper</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Vehicle No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Opening Stock</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Loaded Stock</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRoutes.length > 0 ? (
              currentRoutes.map((route, index) => (
                <tr className="border-b" key={route.id}>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{indexOfFirstItem + index + 1}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.mainRoute}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.subRoute}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.driver}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.helper}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.vehicleNo}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.openingStock}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">{route.loadedStock}</td>
                  <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                    <button onClick={() => handleView(route._id)} className="text-blue-500">
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
