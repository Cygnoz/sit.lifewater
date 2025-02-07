import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import back from "../../assets/images/backbutton.svg";
const CreateSubRoute: React.FC = () => {
  interface Route {
    _id: string;
    mainRouteName: string;
  }

  const [routesList, setRoutesList] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    subRouteName: "",
    subrouteCode: "",
    mainRouteId: "",
    description: "",
  });

  const { request: getMainRoute } = useApi("get", 4000);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const url = `${endpoints.GET_ALL_MAINROUTE}`;
        const { response, error } = await getMainRoute(url);
        if (!error && response) {
          setRoutesList(response.data);
          setFilteredRoutes(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoutes();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setDropdownOpen(true); // Open dropdown while searching

    const filtered = routesList.filter((route) =>
      route.mainRouteName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  const handleSelectRoute = (routeId: string, routeName: string) => {
    setFormData({ ...formData, mainRouteId: routeId });
    setSearch(routeName);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const { request: addSRoute } = useApi("post", 4000);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${endpoints.ADD_SUBROUTE}`;
      const { response, error } = await addSRoute(url, formData);

      if (!error && response) {
        toast.success("Subroute added successfully.");
        setTimeout(() => navigate("/route/subroute"), 2000);
      } else {
        toast.error(error.response?.data?.message || "Failed to add subroute.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="flex gap-4 items-center mb-6">
        <Link to="/route/subroute">
        <img
              className="bg-gray-200 rounded-full p-2"
              src={back}
              alt="Back"
            />
        </Link>
        <h2 className="text-2xl font-bold">Add New Sub Route</h2>
      </div>

      <div className="bg-white rounded-md shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700">Sub Route</label>
              <input
                type="text"
                name="subRouteName"
                value={formData.subRouteName}
                onChange={handleInputChange}
                placeholder="Enter subroute"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Sub Route Code</label>
              <input
                type="text"
                name="subrouteCode"
                value={formData.subrouteCode}
                onChange={handleInputChange}
                placeholder="Enter subroute code"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Search Bar + Dropdown */}
            <div className="relative">
              <label className="block text-gray-700">Main Route</label>
              <input
                type="text"
                placeholder="Search main route"
                value={search}
                onChange={handleSearch}
                onFocus={() => setDropdownOpen(true)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />

              {/* Dropdown List */}
              {dropdownOpen && (
                <ul className="absolute w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded-md shadow-md z-10">
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((route) => (
                      <li
                        key={route._id}
                        onClick={() => handleSelectRoute(route._id, route.mainRouteName)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {route.mainRouteName}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link to={"/route/subroute"}>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-10 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubRoute;
