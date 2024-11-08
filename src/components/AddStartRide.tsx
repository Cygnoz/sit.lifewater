import React, { useEffect, useState } from 'react';
 
import { useNavigate } from 'react-router-dom';
import { addActiveRouteAPI, getAllStaffsAPI, getSubRoutesAPI, getVehicleAPI } from '../services/StartRide/StartRide';
import { BASEURL } from '../services/BaseURL';
 
interface Route {
  _id: string;
  subRoute: string;
  mainRoute: string;
}
 
interface Staff {
  designation: string;
  _id: string;
  firstname: string;
  lastname: string;
}
 
interface Vehicle {
  _id: string;
  vehicleNo: string;
}
 
const AddStartRide: React.FC = () => {
  const [routesList, setRouteList] = useState<Route[]>([]);
  const [mainRouteList, setMainRouteList] = useState<string[]>([]);
  const [selectedMainRoute, setSelectedMainRoute] = useState<string>('');
  const [selectedSubRoute, setSelectedSubRoute] = useState<string>('');
  const [filteredSubRoutes, setFilteredSubRoutes] = useState<Route[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const [openingStock, setOpeningStock] = useState<number | ''>('');
  const [loadedStock, setLoadedStock] = useState<number | ''>('');
  const [totalStock, setTotalStock] = useState<number | ''>('');
  const [startingKm, setStartingKm] = useState<number | ''>('');
  const navigate = useNavigate();
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [storedProfile, setStoredProfile] = useState<string | null>(null);
 
  // Retrieve username from session storage on component load
  useEffect(() => {
    const savedUsername = localStorage.getItem("firstname");
    const storedProfile = localStorage.getItem("profile");
    if (savedUsername && storedProfile) {
      console.log(savedUsername , storedProfile);
      setStoredUsername(savedUsername);
      setStoredProfile(storedProfile)
    }
  }, []);
 
  useEffect(() => {
    const fetchSubRoutes = async () => {
      try {
        const response = await getSubRoutesAPI();
        setRouteList(response);
  
        // Ensure uniqueMainRoutes is typed correctly
        const uniqueMainRoutes: string[] = Array.from(new Set(response.map((route: Route) => route.mainRoute)));
        setMainRouteList(uniqueMainRoutes);
      } catch (error) {
        console.error('Error fetching sub-route data:', error);
      }
    };
  
    fetchSubRoutes();
  }, []);
 
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getAllStaffsAPI();
        setStaffList(response as any);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };
 
    fetchStaff();
  }, []);
 
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const apiResponse = await getVehicleAPI() as Vehicle[]; // Ensure correct typing
        setVehicleList(apiResponse);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setVehicleList([]);
      }
    };
  
    fetchVehicle();
  }, []);
 
  // Update filtered sub-routes based on selected main route
  const handleMainRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mainRoute = event.target.value;
    setSelectedMainRoute(mainRoute);
    setFilteredSubRoutes(routesList.filter(route => route.mainRoute === mainRoute));
    setSelectedSubRoute(''); // Reset sub-route selection
  };
 
  const handleSubRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubRoute(event.target.value);
  };
 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
 
    const newActiveRoute = {
      mainRoute: selectedMainRoute,
      subRoute: selectedSubRoute,
      helper: (document.getElementById('helper') as HTMLSelectElement)?.value,
      driver: (document.getElementById('driver') as HTMLSelectElement)?.value,
      vehicleNo: (document.getElementById('vehicle') as HTMLSelectElement)?.value,      
      openingStock,
      loadedStock,
      totalStock,
      startingKm,
      salesman:storedUsername
    };
 
    try {
      const response = await addActiveRouteAPI(newActiveRoute);
      console.log('ActiveRoute created successfully:', response);
      const { driver, vehicleNo, mainRoute, loadedStock, subRoute, startingKm } = response?.data;
      const  activeRouteId = response?.data?._id
      localStorage.setItem("activeRouteId", activeRouteId)
      localStorage.setItem("driver", driver); // Replace driverValue with the actual driver data
      localStorage.setItem("vehicleNo", vehicleNo); // Replace vehicleNoValue with the actual vehicle number
      localStorage.setItem("mainRoute", mainRoute); // Replace mainRouteValue with the actual route data
      localStorage.setItem("stock", loadedStock); // Replace stockValue with the actual stock data
      localStorage.setItem("subRoute",subRoute);
      localStorage.setItem("startingKm",startingKm);
    
  

      console.log('activeroute set in localStorage');
      
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the ActiveRoute.');
    }
  };
 
  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg mt-3">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-md p-6">
        <header className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-2">
        <div className="">
              <p className="text-[#000000] text-[14px] font-[700]">
                Hello,
                {storedUsername ? (
                 <span> {storedUsername}</span>
                ) : (
                  <span>User</span>
                )}
              </p>
              <p className="text-sm">Welcome</p>
            </div>
            {storedProfile ? (
    <img
      className="object-cover w-11 h-11 rounded-full"
      src={`${BASEURL}/uploads/${storedProfile}`}
      alt="Profile"
    />
  ) : (
    <img
      className="object-cover w-11 h-11 rounded-full"
      src="path/to/default-image.jpg"
      alt="Default Profile"
    />
  )}
        </div>
        </header>
 
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Route Selection */}
          <div className="space-y-1">
            <label htmlFor="main-route" className="text-sm font-medium text-gray-700">
              Main Route
            </label>
            <select
              id="main-route"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedMainRoute}
              onChange={handleMainRouteChange}
            >
              <option value="">Select Main Route</option>
              {mainRouteList.map((mainRoute) => (
                <option key={mainRoute} value={mainRoute}>
                  {mainRoute}
                </option>
              ))}
            </select>
          </div>
 
          {/* Sub Route Selection */}
          <div className="space-y-1">
            <label htmlFor="sub-route" className="text-sm font-medium text-gray-700">
              Sub Route
            </label>
            <select
              id="sub-route"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedSubRoute}
              onChange={handleSubRouteChange}
              disabled={!selectedMainRoute} // Disable if no main route selected
            >
              <option value="">Select Sub Route</option>
              {filteredSubRoutes.map((route) => (
                <option key={route._id} value={route.subRoute}>
                  {route.subRoute}
                </option>
              ))}
            </select>
          </div>
 
          <div className="space-y-1">
            <label htmlFor="helper" className="text-sm font-medium text-gray-700">
              Helper
            </label>
            <select id="helper" className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Helper</option>
              {staffList
                .filter((staff) => staff.designation === 'Helper')
                .map((staff) => (
                  <option key={staff._id} value={staff.firstname}>
                    {staff.firstname} {staff.lastname}
                  </option>
                ))}
            </select>
          </div>
 
          <div className="space-y-1">
            <label htmlFor="driver" className="text-sm font-medium text-gray-700">
              Driver
            </label>
            <select id="driver" className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Driver</option>
              {staffList
                .filter((staff) => staff.designation === 'Driver')
                .map((staff) => (
                  <option key={staff._id} value={staff.firstname}>
                    {staff.firstname} {staff.lastname}
                  </option>
                ))}
            </select>
          </div>
 
          <div className="space-y-1">
            <label htmlFor="vehicle" className="text-sm font-medium text-gray-700">
              Select Vehicle Number
            </label>
            <select id="vehicle" className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Vehicle No</option>
              {vehicleList.map((vehicle) => (
                <option key={vehicle._id} value={vehicle.vehicleNo}>
                  {vehicle.vehicleNo}
                </option>
              ))}
            </select>
          </div>
 
          {/* Stock Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="opening-stock" className="text-sm font-medium text-gray-700">
                Opening Stock
              </label>
              <input
                type="number"
                id="opening-stock"
                value={openingStock}
                onChange={(e) => setOpeningStock(Number(e.target.value) || '')}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="loaded-stock" className="text-sm font-medium text-gray-700">
                Loaded Stock
              </label>
              <input
                type="number"
                id="loaded-stock"
                value={loadedStock}
                onChange={(e) => setLoadedStock(Number(e.target.value) || '')}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
 
          {/* Stock Hand and KM */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="total-stock" className="text-sm font-medium text-gray-700">
                Total stock in Hand
              </label>
              <input
                type="number"
                id="total-stock"
                value={totalStock}
                onChange={(e) => setTotalStock(Number(e.target.value) || '')}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="started-km" className="text-sm font-medium text-gray-700">
                Starting KM
              </label>
              <input
                type="number"
                id="startingKm"
                value={startingKm}
                onChange={(e) => setStartingKm(Number(e.target.value) || '')}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
 
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs bg-[#820000] text-white py-2 rounded-lg shadow hover:bg-red-800 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default AddStartRide;