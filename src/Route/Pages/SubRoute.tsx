import printer from "../../assets/images/printer.svg";
import split from "../../assets/images/list-filter.svg";
import search from "../../assets/images/search.svg";
import pen from "../../assets/images/pen.svg";
import trash from "../../assets/images/trash.svg";
import { useNavigate } from "react-router-dom";
import dot from "../../assets/ellipsis-vertical.svg";
import plus from "../../assets/circle-plus.svg";
import { useEffect, useRef, useState } from "react";
import {
  deleteSubRouteAPI,
  getSubRoutesAPI,
} from "../../services/RouteAPI/subRouteAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import eye from "../../assets/images/eye.svg";

interface Route {
  id: string;
  _id: string;
  mainRoute: string;
  subrouteCode: string;
  subRoute: string;
  description: string;
}

type Props = {};

function SubRoute({}: Props) {
  const [routesList, setRouteList] = useState<Route[]>([]); // Full route list
  const [filteredRouteList, setFilteredRouteList] = useState<Route[]>([]); // Filtered route list
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getSubRoutesAPI();
        setRouteList(response); // Store full route list
        setFilteredRouteList(response); // Initially display all routes
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    fetchRoutes();
  }, []);

  // Filter the route list whenever searchQuery changes
  useEffect(() => {
    const filtered = routesList.filter(
      (route) =>
        route.subRoute.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.subrouteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.mainRoute.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRouteList(filtered);
  }, [searchQuery, routesList]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subroute?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteSubRouteAPI(id); // Pass the _id to the API function
      toast.success(response.message); // Show success message
      setRouteList(routesList.filter((route) => route._id !== id)); // Update the UI
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("An error occurred while deleting the route.");
    }
  };

  const navigate = useNavigate();

  const handleCreate = (): void => {
    navigate("/route/newsubroute");
  };

  const handleEdit = (id: string): void => {
    navigate(`/route/editsubroute/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  const handleView = (id: string): void => {
    navigate(`/route/viewsubroute/${id}`);
  };

  const tableRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    const printContent = tableRef.current;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="flex justify-between items-center my-2">
        <div className="  mx-2">
          <h3 className="text-[#303F58] text-[20px] font-bold">
            Create Sub Route
          </h3>
          <p className="text-[#4B5C79]">
            Lorem ipsum dolor sit amet consectetur{" "}
          </p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleCreate}
            className="flex justify-between items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md"
          >
            <img src={plus} alt="" />
            <p>Add New Sub Route</p>
          </button>
          <button className="ms-2 me-4">
            <img src={dot} alt="" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-5">
        <div className="flex justify-between items-center mb-4">
          {/* Search Input */}
          <div className="relative w-full flex items-center">
            <div className="absolute left-2">
              <img src={search} alt="search" className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.04)",
                outline: "none",
                boxShadow: "none",
              }}
              placeholder="Search Route"
            />
          </div>

          <div className="flex w-[60%] justify-end">
            <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
              <img src={split} className="mt-1 me-1" alt="" />
              Sort By
            </button>
            <button
              onClick={handlePrint}
              className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 rounded-lg"
            >
              <img src={printer} className="mt-1 me-1" alt="" />
              Print
            </button>
          </div>
        </div>

        <div ref={tableRef}>
          <table className="print-table w-full text-left">
            <thead className="bg-[#fdf8f0]">
              <tr className="border-b">
                <th scope="col" className="no-print px-6 py-3">
                  <input type="checkbox" />
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sl No
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sub Route
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sub Route Code
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Main Route
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Description
                </th>
                <th className="no-print p-2 text-[12px] text-center text-[#303F58]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRouteList.map((route, index) => (
                <tr className="border-b" key={route._id}>
                  <td className="no-print px-6 py-4">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {index + 1}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {route.subRoute}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {route.subrouteCode}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {route.mainRoute}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {route.description}
                  </td>
                  <td className="no-print p-2 text-[14] text-center text-[#4B5C79]">
                    <button
                      onClick={() => handleView(route._id)}
                      className="text-red-500 mx-2 ml-2"
                    >
                      <img src={eye} alt="" />
                    </button>
                    <button
                      onClick={() => handleEdit(route._id)}
                      className="text-blue-500 mx-2 items-center"
                    >
                      <img src={pen} alt="" />
                    </button>
                    <button
                      onClick={() => handleDelete(route._id)}
                      className="text-red-500 ml-2"
                    >
                      <img src={trash} alt="" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SubRoute;
