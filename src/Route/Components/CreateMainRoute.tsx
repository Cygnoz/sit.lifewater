import React, { useState, ChangeEvent, FormEvent } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";

const AddMainRoute: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // State to manage form values
  const [formData, setFormData] = useState({
    mainRouteName: "",
    mainRouteCode: "",
    description: "",
  });

  // Handler to update form state
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData);

  const { request: addMainRoute } = useApi("post", 4000);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(loading);
    

    try {
      // Prepare the payload
      const payload = {
        ...formData,
      };
      console.log(payload);

      // Call the API to add the item
      const url = `${endpoints.ADD_MAINROUTE}`;
      const { response, error } = await addMainRoute(url, payload);

      if (!error && response) {
        toast.success("Main Route has been added successfully.");
        setTimeout(() => {
          navigate("/route/createroute");
        }, 3000);
      } else {
        // Handle any API errors
        toast.error(error?.message || "Failed to add mainroute. Please try again.");
      }
    } catch (err) {
      console.error("Error adding mainroute:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-2">
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
        // optional CSS class for further styling
      />
      {/* First Row: Heading and Icon */}
      <div className="flex gap-4 items-center w-full max-w-8xl mb-6">
        <Link to={"/route/createroute"}>
          <div className="icon-placeholder">
            <img
              className="bg-gray-200 rounded-full p-2"
              src={back}
              alt="Back"
            />
          </div>
        </Link>
        <h2 className="text-2xl font-bold">Create New Main Route</h2>
      </div>

      {/* Second Row: Form Container */}
      <div className="w-full max-w-8xl bg-white rounded-md shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Main Route
              </label>
              <input
                type="text"
                name="mainRouteName"
                value={formData.mainRouteName}
                onChange={handleInputChange}
                placeholder="Enter main route"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required // Add required attribute for validation
              />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Route Code
              </label>
              <input
                type="text"
                name="mainRouteCode"
                value={formData.mainRouteCode}
                onChange={handleInputChange}
                placeholder="Enter route code"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required // Add required attribute for validation
              />
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
              style={{ resize: "none", overflow: "hidden" }} // Inline styles to remove resize handles
             
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-2 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              onClick={() =>
                setFormData({ mainRouteName: "", mainRouteCode: "", description: "" })
              } // Optional: reset on cancel
            >
              Cancel
            </button>
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

export default AddMainRoute;
