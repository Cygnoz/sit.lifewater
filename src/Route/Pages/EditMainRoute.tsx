import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import back from '../../assets/images/backbutton.svg';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { endpoints } from '../../services/ApiEndpoint';
import useApi from '../../Hook/UseApi';


const EditMainRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get route ID from URL params
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    mainRouteName: '',
    mainRouteCode: '',
    description: ''
  });

 

  const { request: getAmainroute } = useApi("get", 4000)

  const getAamainroute = async () => {
    try {
      const url = `${endpoints.GET_A_MAINROUTE}/${id}`;
      const { response, error } = await getAmainroute(url);
      console.log("API RESPONSE :", response);
  
      if (!error && response) {
        const mainRoute = response.data.data.mainRoute; // Access the nested mainRoute data
        setFormData({
          mainRouteName: mainRoute.mainRouteName || "",
          mainRouteCode: mainRoute.mainRouteCode || "",
          description: mainRoute.description || "",
        });
      }
    } catch (error) {
      console.error("Error fetching main route:", error);
    }
  };
  

  useEffect(() => {
    getAamainroute()
  }, [])


  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const { request: editMainroute } = useApi("put", 4000)

  // Handle form submission to update the subRoute
  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    try {
      if (!id) {
        toast.error("Invalid ID");
        return;
      }

  
      // Construct the API URL
      const url = `${endpoints.UPDATE_A_MAINROUTE}/${id}`;
  
      console.log("Submitting updated mainroute data:", formData);
  
      // Call the API using the useApi `editSubRoute` request
      const { response, error } = await editMainroute(url, formData);
  
      if (!error && response) {
        console.log("API Response:", response);
        toast.success("Mainroute updated successfully!");
        setTimeout(()=>{
          navigate("/route/createroute"); // Redirect after successful edit
        },1000)
      } else {
        toast.error("Failed to update mainroute. Please check the data.");
      }
    } catch (error) {
      console.error("Error while updating mainroute:", error);
      toast.error("An error occurred while updating the mainroute.");
    }
  };


  console.log("this",formData);
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-2">
      <ToastContainer
        position="top-center"
        autoClose={2000}
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
        <Link to={'/route/createroute'}>
          <div className="icon-placeholder">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-2xl font-bold">Edit Main Route</h2>
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
                value={formData.mainRouteName || ''}  // Ensure it's not undefined
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Route Code
              </label>
              <input
                type="text"
                name="mainRouteCode"
                value={formData.mainRouteCode || ''}  // Ensure it's not undefined
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}  // Ensure it's not undefined
              onChange={handleInputChange}
              className="w-full h-[36px] px-3 py-2 border border-[#CECECE] rounded-[4px] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ resize: 'none', overflow: 'hidden' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-2 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              onClick={() => navigate('/route/createroute')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-2 bg-red-800 text-white rounded-md hover:bg-red-800 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMainRoute;
