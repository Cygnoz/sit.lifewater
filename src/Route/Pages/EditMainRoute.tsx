import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import back from '../../assets/images/backbutton.svg';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getRouteByIdAPI, updateRouteAPI } from '../../services/RouteAPI/RouteAPI';


const EditMainRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get route ID from URL params
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    mainRoute: '',
    routeCode: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(true);  // Add loading state

  // Fetch existing route data (if editing)
 useEffect(() => {
  const fetchRouteData = async () => {
    try {
      if (!id) {
        console.warn("Route ID is undefined");
        return;
      }
      
      const response = await getRouteByIdAPI(id); // Now `id` is safely a string
      setFormData(response.data.mainRoute); // Populate the form with fetched data
      setIsLoading(false); // Set loading to false after data is fetched
    
    } catch (error) {
      console.error('Error fetching route data:', (error as Error).message);
      toast.error('Error fetching route data');
      setIsLoading(false);
    }
  };

  fetchRouteData();
}, [id]);


  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission to update the route
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRouteAPI(id, formData); // Call the API method to update
      toast.success('Route updated successfully!');
      navigate('/route/createroute'); // Redirect after update
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error('Route code already exist. Try another one !');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message until data is fetched
  }
  console.log("this",formData);
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
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
                name="mainRoute"
                value={formData.mainRoute || ''}  // Ensure it's not undefined
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
                name="routeCode"
                value={formData.routeCode || ''}  // Ensure it's not undefined
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
