import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";

const CreateSubRoute: React.FC = () => {
  interface Route {
    _id: string;
    subRoute: string;
    subrouteCode: string;
    mainRouteName: string;
    description: string;
  }

  const [routesList, setRouteList] = useState<Route[]>([]); // Full route list
  const [filteredRouteList, setFilteredRouteList] = useState<Route[]>([]); // Filtered route list
  const [loading, setLoading] = useState(false);
  console.log(filteredRouteList);

  // State to manage form values
  const [formData, setFormData] = useState({
    subRouteName: "",
    subrouteCode: "", // Updated to match the form input name
    mainRouteId: "",
    description: "",
  });

  const { request: getMainRoute } = useApi("get", 4000);

  const getAllMainRoutes = async () => {
    try {
      const url = `${endpoints.GET_ALL_MAINROUTE}`;
      const { response, error } = await getMainRoute(url);
      console.log(response);

      if (!error && response) {
        setRouteList(response.data);
        setFilteredRouteList(response.data);
        // setSortedItems(response.data); // Initialize sorted items
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMainRoutes();
  }, []);

  // Handler to update form state
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate(); // Initialize navigate here

  const { request: addSRoute } = useApi("post", 4000);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);
    console.log(loading);

    try {
      // Prepare the payload
      const payload = {
        ...formData,
      };
      console.log(payload);

      // Call the API to add the item
      const url = `${endpoints.ADD_SUBROUTE}`;
      const { response, error } = await addSRoute(url, payload);

      if (!error && response) {
        toast.success("subroute has been added successfully.");
        setFormData({
          subRouteName: "",
          subrouteCode: "", // Updated to match the form input name
          mainRouteId: "",
          description: "",
        });
        setTimeout(() => {
          navigate("/route/subroute");
        }, 3000);
      } else {
        // Handle any API errors
        toast.error(
          error.response?.data?.message ||
            "Failed to add subroute. Please try again."
        );
      }
    } catch (err) {
      console.error("Error adding subroute:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
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
      <div className="flex gap-4 items-center w-full max-w-8xl mb-6">
        <Link to="/route/subroute">
          <div className="icon-placeholder">
            <img
              className="bg-gray-200 rounded-full p-2"
              src={back}
              alt="Back"
            />
          </div>
        </Link>
        <h2 className="text-2xl font-bold">Add New Sub Route</h2>
      </div>

      <div className="w-full max-w-8xl bg-white rounded-md shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Sub Route
              </label>
              <input
                type="text"
                name="subRouteName"
                value={formData.subRouteName}
                onChange={handleInputChange}
                placeholder="Enter subroute"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Sub Route Code
              </label>
              <input
                type="text"
                name="subrouteCode" // Updated name to match the state key
                value={formData.subrouteCode}
                onChange={handleInputChange}
                placeholder="Enter subroute code"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Main Route
              </label>
              <select
                name="mainRouteId"
                value={formData.mainRouteId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select main route
                </option>
                {routesList.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.mainRouteName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full h-[36px] px-3 py-2 border border-[#CECECE] rounded-[4px] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ resize: "none", overflow: "hidden" }}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link to={"/route/subroute"}>
              <button
                type="button"
                className="px-2 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="px-10 py-2 bg-red-800 text-white rounded-md hover:bg-red-800 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubRoute;
