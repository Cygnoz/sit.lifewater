import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import back from '../../assets/images/backbutton.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getRoutesAPI } from '../../services/RouteAPI/RouteAPI';
import { addSubRouteAPI } from '../../services/RouteAPI/subRouteAPI';


const CreateSubRoute: React.FC = () => {
  interface Route {
    _id: string;
    subRoute: string;
    subrouteCode: string;
    mainRoute: string;
    description: string;
  }

  const [routesList, setRouteList] = useState<Route[]>([]); // Full route list
  const [filteredRouteList, setFilteredRouteList] = useState<Route[]>([]); // Filtered route list
  console.log(filteredRouteList);
  

  // State to manage form values
  const [formData, setFormData] = useState({
    subRoute: '',
    subrouteCode: '', // Updated to match the form input name
    mainRoute: '',
    description: '',
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getRoutesAPI();
        setRouteList(response);
        setFilteredRouteList(response); // Initially, display all routes
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  // Handler to update form state
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler for form submission
  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!formData.mainRoute || !formData.subrouteCode) {
  //     toast.warning('Main Route and Subroute Code are required fields.');
  //     return;
  //   }

  //   try {
  //     const response = await addSubRouteAPI(formData); // Send the form data as JSON
  //     toast.success('Subroute created successfully!');
  //     setFormData({
  //       subRoute: '',
  //       subrouteCode: '',
  //       mainRoute: '',
  //       description: '',
  //     });
  //   } catch (error: any) {
  //     console.error('Error submitting form:', error.message);
  //     toast.error('Failed to create subroute. Please try again.');
  //   }
  // };
  const navigate = useNavigate(); // Initialize navigate here

   const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.mainRoute || !formData.subrouteCode) {
      toast.warning('Main Route and Subroute Code are required fields.');
      return;
    }

    try {
      await addSubRouteAPI(formData);
      toast.success('Subroute created successfully!');
      setFormData({
        subRoute: '',
        subrouteCode: '',
        mainRoute: '',
        description: '',
      });
      navigate('/route/subroute'); // Redirect after success
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
      toast.error('Failed to create subroute. Please try again.');
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
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-2xl font-bold">Add New Sub Route</h2>
      </div>

      <div className="w-full max-w-8xl bg-white rounded-md shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Sub Route</label>
              <input
                type="text"
                name="subRoute"
                value={formData.subRoute}
                onChange={handleInputChange}
                placeholder="Enter subroute"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Sub Route Code</label>
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
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Main Route</label>
              <select
                name="mainRoute"
                value={formData.mainRoute}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>Select main route</option>
                {routesList.map((route) => (
                  <option key={route._id} value={route.mainRoute}>
                    {route.mainRoute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full h-[36px] px-3 py-2 border border-[#CECECE] rounded-[4px] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ resize: 'none', overflow: 'hidden' }}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" className="px-2 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
              Cancel
            </button>
            <button type="submit" className="px-10 py-2 bg-red-800 text-white rounded-md hover:bg-red-800 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubRoute;
