import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";

interface Route {
  _id: string;
  subRoute: string;
  mainRouteName: string;
  subRouteName: string;
  stock: [];
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
  const [selectedMainRoute, setSelectedMainRoute] = useState<{
    mainRouteName: string;
    mainRouteId: string | null;
  } | null>(null);

  const [selectedSubRoute, setSelectedSubRoute] = useState<{
    subRouteName: string;
    subRouteId: string | null;
    stock: [];
  } | null>(null);

  const [mainRouteList, setMainRouteList] = useState<
    { mainRouteName: string; mainRouteId: string }[]
  >([]);
  const [filteredSubRoutes, setFilteredSubRoutes] = useState<
    { subRouteName: string; _id: string; stock: [] }[]
  >([]);
  const [selectedHelper, setSelectedHelper] = useState<{
    name: string;
    id: string | null;
  } | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<{
    name: string;
    id: string | null;
  } | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    vehicleNo: string;
    id: string | null;
  } | null>(null);  

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [openingStock, setOpeningStock] = useState<number | "">("");
  const [startingKm, setStartingKm] = useState<number | "">("");
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const navigate = useNavigate();

  const [storedUsername, setStoredUsername] = useState<any | null>(null);
  const firstname = JSON.parse(localStorage.getItem("firstname") || "{}");
  // Fetch localStorage data on mount
  useEffect(() => {
    setStoredUsername(firstname);
  }, []);
  const handleMainRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const mainRouteName = event.target.value;

    // Find the selected main route details
    const selectedMainRouteDetails = mainRouteList.find(
      (route) => route.mainRouteName === mainRouteName
    );

    setSelectedMainRoute({
      mainRouteName,
      mainRouteId: selectedMainRouteDetails?.mainRouteId || null,
    });

    // Filter subroutes based on the selected main route
    const filtered = routesList.filter(
      (route) => route.mainRouteName === mainRouteName
    );

    setFilteredSubRoutes(
      filtered.map((subRoute) => ({
        subRouteName: subRoute.subRouteName,
        _id: subRoute._id,
        stock: subRoute.stock,
      }))
    );

    // Reset the selected subroute
    setSelectedSubRoute(null);
  };

  const handleSubRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subRouteId = event.target.value;

    // Find the selected subroute details
    const selectedSubRouteDetails = filteredSubRoutes.find(
      (subRoute) => subRoute._id === subRouteId
    );

    if (selectedSubRouteDetails) {
      setSelectedSubRoute({
        subRouteName: selectedSubRouteDetails?.subRouteName || "",
        subRouteId: selectedSubRouteDetails?._id || null,
        stock: selectedSubRouteDetails?.stock || [],
      });

      // Update the opening stock as the length of the stock array
      setOpeningStock(selectedSubRouteDetails.stock.length);
    } else {
      setSelectedSubRoute(null);
      setOpeningStock(""); // Reset if no subroute is selected
    }
  };

  const { request: getSubRoute } = useApi("get", 4000);

  useEffect(() => {
    const fetchSubRoutes = async () => {
      try {
        const url = `${endpoints.GET_ALL_SUBROUTE}`;
        const { response, error } = await getSubRoute(url);

        if (error) {
          console.error("Error fetching sub-route data:", error);
          toast.error("Failed to fetch route data. Please try again.");
          return;
        }

        const routes = Array.isArray(response) ? response : response?.data;

        if (routes && Array.isArray(routes)) {
          // Process and set the route list with stock details
          setRouteList(routes);

          console.log("All subroute and stock data:", routes);

          // Extract unique main routes with their IDs
          const uniqueMainRoutes = Array.from(
            new Map(
              routes.map((route) => [
                route.mainRouteName,
                {
                  mainRouteName: route.mainRouteName,
                  mainRouteId: route.mainRouteId,
                },
              ])
            ).values()
          );
          setMainRouteList(uniqueMainRoutes);
        }
      } catch (err) {
        console.error("Error fetching sub-route data:", err);
        toast.error("An unexpected error occurred. Please try again.");
      }
    };

    fetchSubRoutes();
  }, []);

  // Vehicle
  const { request: getAllVehicleData } = useApi("get", 4000);
  const getAllVehicle = async () => {
    try {
      const url = `${endpoints.GET_ALL_VEHICLES}`;
      const { response, error } = await getAllVehicleData(url);
      if (!error && response) {
        setVehicleList(response.data);
        console.log(response.data, "vehicle");
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVehicle();
  }, []);

  // staff , helper and driver details
  const { request: getAllStaffData } = useApi("get", 4000);
  const getAllStaff = async () => {
    try {
      const url = `${endpoints.GET_ALL_STAFF}`;
      const { response, error } = await getAllStaffData(url);
      if (!error && response) {
        setStaffList(response.data);
        console.log("staff", response.data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const handleHelperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const helperId = event.target.value;

    // Find the selected helper's details
    const selectedHelperDetails = staffList.find(
      (staff) => staff._id === helperId
    );

    setSelectedHelper({
      name: `${selectedHelperDetails?.firstname}`,
      id: selectedHelperDetails?._id || null,
    });
  };

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = event.target.value;
  
    const selectedVehicle = vehicleList.find((vehicle) => vehicle._id === vehicleId);
  
    if (selectedVehicle) {
      setSelectedVehicle({
        vehicleNo: selectedVehicle.vehicleNo, 
        id: selectedVehicle._id,
      });
    }
  };
  

  console.log("Selected helper", selectedHelper?.name); // "John Doe"
  console.log("Selected helper", selectedHelper?.id); // "abcd1234"
  console.log("Selected vehicle", selectedVehicle?.vehicleNo); // "abcd1234"
  console.log("Selected vehicle id", selectedVehicle?.id); // "abcd1234"

  const handleDriverChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const driverId = event.target.value;

    // Find the selected helper's details
    const selectedDriverDetails = staffList.find(
      (staff) => staff._id === driverId
    );

    setSelectedDriver({
      name: `${selectedDriverDetails?.firstname} ${selectedDriverDetails?.lastname}`,
      id: selectedDriverDetails?._id || null,
    });
  };
  // for stock details
  const formattedStock = selectedSubRoute?.stock
  ?.filter((item: any) => item.quantity > 0) // Filters only items with quantity > 0
  .map((item: any) => ({
    itemId: item.itemId, 
    itemName: item.itemName || "Unknown Item", 
    quantity: item.quantity, 
    sellingPrice: item.sellingPrice,
    status: item.status || "NA",
  }));


  const { request: addStartRide } = useApi("post", 4000);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Ensure all required fields are selected
    if (
      !selectedMainRoute ||
      !selectedSubRoute ||
      !startingKm ||
      !selectedDriver
      // !selectedHelper
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Format stock data
    const formattedStock = selectedSubRoute?.stock.map((item: any) => ({
      itemId: item.itemId, // Replace with the actual field
      itemName: item.itemName || "Unknown Item", // Replace with the actual field
      quantity: item.quantity || 1, // Replace with the actual field
      sellingPrice: item.sellingPrice,
      status: item?.status || "NA",
    }));

    // Create payload
    const newActiveRoute = {
      mainRouteId: selectedMainRoute?.mainRouteId,
      mainRouteName: selectedMainRoute?.mainRouteName,
      subRouteId: selectedSubRoute?.subRouteId,
      subRouteName: selectedSubRoute?.subRouteName,
      helperName: selectedHelper?.name,
      helperId: selectedHelper?.id,
      driverName: selectedDriver?.name,
      driverId: selectedDriver?.id,
      vehicleId: selectedVehicle?.id, // Ensure _id is used
      vehicleNumber: selectedVehicle?.vehicleNo, // Ensure vehicle number is stored correctly
      stock: formattedStock || [],
      startingKm,
      salesmanName: storedUsername?.data.firstname,
      salesmanId: storedUsername?.data._id,
    };

    console.log("Payload to be sent:", newActiveRoute);

    try {
      const url = `${endpoints.ADD_ACTIVE_ROUTE}`;
      console.log("API :", url);

      const { response, error } = await addStartRide(url, newActiveRoute);

      if (error) {
        console.error("Error posting Start Ride data:", error);
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to Start Ride"
        );
        return;
      }

      if (response) {
        console.log("Start Ride Response:", response);
        toast.success("Ride started successfully!");
        // const StartRide = localStorage.setItem(
        //   "StartRide",
        //   JSON.stringify(response.data)
        // );
        // console.log(StartRide);
        setTimeout(() => {
          navigate("/customers"); // Navigate to rides page or any other page
        }, 2000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg mt-3">
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
      <div className="bg-white w-full max-w-lg rounded-lg shadow-md p-6">
        <header className="flex justify-end items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="">
              <p className="text-[#000000] text-[14px] font-[700]">
                Hello,
                {storedUsername?.data.firstname}
              </p>
              <p className="text-sm">Welcome</p>
            </div>
            <img
              src={storedUsername?.data.profile}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Route Selection */}

          <div>
            <label
              htmlFor="helper"
              className="text-sm font-medium text-gray-700"
            >
              Main Route
            </label>
            <select
              onChange={handleMainRouteChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Main Route</option>
              {mainRouteList.map((route) => (
                <option key={route.mainRouteId} value={route.mainRouteName}>
                  {route.mainRouteName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="helper"
              className="text-sm font-medium text-gray-700"
            >
              Sub Route
            </label>
            <select
              onChange={handleSubRouteChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Sub Route</option>
              {filteredSubRoutes.map((subRoute) => (
                <option key={subRoute._id} value={subRoute._id}>
                  {subRoute.subRouteName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="helper"
              className="text-sm font-medium text-gray-700"
            >
              Helper
            </label>
            <select
              id="helper"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleHelperChange}
              // required
            >
              <option value="">Select Helper</option>
              {staffList
                .filter((staff) => staff.designation === "Helper")
                .map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstname} {staff.lastname}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="helper"
              className="text-sm font-medium text-gray-700"
            >
              Driver
            </label>
            <select
              id="helper"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleDriverChange}
              // required
            >
              <option value="">Select Driver</option>
              {staffList
                .filter((staff) => staff.designation === "Driver")
                .map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstname} {staff.lastname}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="vehicle"
              className="text-sm font-medium text-gray-700"
            >
              Select Vehicle Number
            </label>
            <select
  id="vehicle"
  className="w-full p-2 border border-gray-300 rounded-lg"
  required
  onChange={handleVehicleChange} // Add this
>
  <option value="">Select Vehicle No</option>
  {vehicleList.map((vehicle) => (
    <option key={vehicle._id} value={vehicle._id}> 
      {vehicle.vehicleNo}
    </option>
  ))}
</select>

          </div>

          {/* Stock Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="opening-stock"
                className="text-sm font-medium text-gray-700"
              >
                Total Item
              </label>
              <input
                type="number"
                id="opening-stock"
                value={openingStock}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="started-km"
                className="text-sm font-medium text-gray-700"
              >
                Starting KM
              </label>
              <input
                type="number"
                id="startingKm"
                value={startingKm}
                onChange={(e) => setStartingKm(Number(e.target.value) || "")}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter starting KM"
              />
            </div>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#fdf8f0]">
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                      Item
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formattedStock && formattedStock.length > 0 ? (
                    formattedStock.map(
                      (
                        item: { itemName: string; quantity: number },
                        index: number
                      ) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="border border-gray-300 px-4 py-2">
                            {item.itemName || "Unknown Item"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.quantity || 0}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        className="border border-gray-300 px-4 py-2 text-center"
                        colSpan={2}
                      >
                        No stock available in this Subroute
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
