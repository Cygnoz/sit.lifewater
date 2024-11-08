import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import car from "../../assets/images/car-front.png";
import user from "../../assets/images/user.png";
import user2 from "../../assets/images/user2.png";
import map from "../../assets/images/map-pinned.png";
import bottle from "../../assets/images/bottlesvg.svg";
import history from "../../assets/images/history.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
import { getRouteByIdAPI } from "../../services/RouteAPI/RouteAPI";
import { getAllEndRidesAPI } from "../../services/RouteAPI/ActiveRoute";
import search from "../../assets/images/search.svg";
import vector from "../../assets/images/Vector.svg";
import map1 from "../../assets/images/map-pin.svg";
import { getActiveRouteAPI } from "../../services/RouteAPI/ActiveRoute";

interface Route {
  _id: string;
  date?: string; // Assuming date might be optional
  salesMan: string;
  driver: string;
  vehicleNo: string;
  createdAt: string;
  mainRoute: string;
  subRoute: string;
  stock: number;
  sold?: number; // Assuming sold might be optional
  subrouteCode: string;
}

interface Ride {
  _id: string;
  endingKM: string;
  createdAt: string;
  travelledKM: string;
  salesMan: string | null;
  date?: string;
  sold?: number;
  driver: string;
  vehicleNo: string;
  mainRoute: string;
  stock: string;
  expenses: Array<{
    remarks: string;
    amount: string;
    _id: string;
  }>;
  activeRouteId: string;
  __v: number;
  subRoute?: string; // Add subRoute if it's part of your data
}

const ViewRoute: React.FC = () => {
  const [activeSection, setActiveSection] = useState("routeDetail");
  const [routeData, setRouteData] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);

  const [error, setError] = useState("");
  const { id } = useParams(); // Assumes route ID is passed as a URL parameter
  const [mainRouteList, setMainRouteList] = useState<Route[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [mostVisitedSalesman, setMostVisitedSalesman] = useState<string | null>(
    null
  );
  const [mainroute, setMainRoute] = useState<any>(null);
  const [mostVisitedVehicle, setMostVisitedVehicle] = useState<string | null>(
    null
  );
  const [rideList, setRideList] = useState<Route[]>([]);
  const [mainRideList, setMainRideList] = useState<Route[]>([]);
  const [mostVisitedSbRoute, setMostVisitedSubRoute] = useState<string | null>(
    null
  );
  const [activeRoutes, setActiveRoutes] = useState<any[]>([]); // Add a type assertion for clarity
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [searchTerms, setSearchTerms] = useState<string>(""); // Search term state
  const [totalStock,setTotalStock]=useState(0)
  const navigate = useNavigate();
console.log(rideList,activeRoutes,rides);

  // State initialization

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const response = await getRouteByIdAPI(id as string);
        setRouteData(response.data); // Store the full data
        console.log("Full route data:", response.data);

        // Set mainRoute and subroutes directly from response data
        setMainRoute(response.data.mainRoute);
        setMainRouteList(response.data.subroutes); // No need to filter
        setRoute(response.data.mainRoute.mainRoute);
        console.log("Main Route:", response.data.mainRoute);
        console.log("Sub Routes:", response.data.subroutes);
      } catch (err: any) {
        setError(err.message || "Failed to load route data");
        console.log(error, "er");
      }
    };

    fetchRouteData();
  }, [id]);

  // Specify the main route you want to filter by

  useEffect(() => {
    const fetchData = async () => {
      try {
        const targetMainRoute = route;
        if (!targetMainRoute) {
          console.warn("Main route is undefined");
          return;
        }

        const data: { data: Ride[] } = await getAllEndRidesAPI();
        setRides(data.data); // Set the full list of rides

        // Filter rides by the specified main route
        const filteredRides = data.data.filter(
          (ride) => ride.mainRoute === targetMainRoute
        );

        if (filteredRides.length === 0) {
          console.warn(`No rides found for main route: ${targetMainRoute}`);
          setMostVisitedSalesman(null);
          setMostVisitedVehicle(null);
          setMostVisitedSubRoute(null);
          return;
        }

        // Count occurrences of each salesMan, vehicleNo, and subRoute within the filtered rides
        const salesCount: Record<string, number> = {};
        const vehicleCount: Record<string, number> = {};
        const subRouteCount: Record<string, number> = {};

        filteredRides.forEach((ride) => {
          const { salesMan, vehicleNo, subRoute } = ride;

          if (salesMan) {
            salesCount[salesMan] = (salesCount[salesMan] || 0) + 1;
          }

          if (vehicleNo) {
            vehicleCount[vehicleNo] = (vehicleCount[vehicleNo] || 0) + 1;
          }

          if (subRoute) {
            subRouteCount[subRoute] = (subRouteCount[subRoute] || 0) + 1;
          }
        });

        // Find the most visited salesman, vehicle, and subRoute within the filtered rides
        const mostFrequentSalesman = Object.keys(salesCount).reduce(
          (a, b) => (salesCount[a] > salesCount[b] ? a : b),
          ""
        );

        const mostFrequentVehicle = Object.keys(vehicleCount).reduce(
          (a, b) => (vehicleCount[a] > vehicleCount[b] ? a : b),
          ""
        );

        const mostFrequentSubRoute = Object.keys(subRouteCount).reduce(
          (a, b) => (subRouteCount[a] > subRouteCount[b] ? a : b),
          ""
        );

        setMostVisitedSalesman(mostFrequentSalesman);
        setMostVisitedVehicle(mostFrequentVehicle);
        setMostVisitedSubRoute(mostFrequentSubRoute);

        console.log(
          `Most visited salesman in ${targetMainRoute}: ${mostFrequentSalesman}`
        );
        console.log(
          `Most visited vehicle in ${targetMainRoute}: ${mostFrequentVehicle}`
        );
        console.log(
          `Most visited sub-route in ${targetMainRoute}: ${mostFrequentSubRoute}`
        );
      } catch (error) {
        console.error("Error fetching rides data:", error);
      }
    };

    fetchData();
  }, [route]);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await getAllEndRidesAPI();
        const routes = Array.isArray(response.data) ? response.data : response;
        setRideList(routes);
        console.log("All Routes:", routes);
  
        if (!routeData?.mainRoute?.mainRoute) {
          console.warn("Main route is undefined");
          return;
        }
  
        const mainRoute = routeData.mainRoute.mainRoute;
        const filteredRoutes = routes.filter((ride: Ride) => ride.mainRoute === mainRoute);   
             console.log("Filtered Routes for", mainRoute, ":", filteredRoutes);
  
        setMainRideList(filteredRoutes);
  
        // Calculate total stock for filtered routes
        const totalStock = filteredRoutes.reduce((acc: number, ride: Ride) => acc + Number(ride.stock), 0);     
           console.log("Total Stock for Main Route:", totalStock);
        
        // Optionally set this in state if needed for rendering
        setTotalStock(totalStock); // Make sure to define totalStock in your component's state if needed
      } catch (error) {
        console.error("Error fetching main route data:", error);
      }
    };
  
    fetchRide();
  }, [routeData?.mainRoute?.mainRoute]);
  

  useEffect(() => {
    const fetchActiveRoutes = async () => {
      try {
        const response = await getActiveRouteAPI();

        // Ensure the data is an array, or handle it accordingly
        const routes = Array.isArray(response.data) ? response.data : [];
        setActiveRoutes(routes); // Store the fetched data in state
        console.log(routes);
      } catch (error) {
        console.error("Failed to fetch active routes:", error);
      }
    };

    fetchActiveRoutes();
  }, []);

  const handleEdit = (routeId: string): void => {
    navigate(`/route/editmainroute/${routeId}`);
  };

  // Filter mainRideList based on searchTerm in salesMan and driver
  const filteredRides = mainRideList.filter((ride) => {
    const searchText = searchTerm.toLowerCase();
    return (
      ride?.salesMan?.toLowerCase().includes(searchText) ||
      ride?.driver?.toLowerCase().includes(searchText) ||
      ride?.vehicleNo?.toLowerCase().includes(searchText)
    );
  });

  // Filter mainRouteList based on searchTerm in salesMan and driver
  const filteredRoutes = mainRouteList.filter((route) => {
    const searchText = searchTerms.toLowerCase();
    return (
      route?.subRoute?.toLowerCase().includes(searchText) ||
      route?.mainRoute?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="p-2">
      <div className="flex justify-between gap-3 items-center w-full max-w-8xl mb-3 ">
        <div>
          <div className="icon-placeholder flex">
            <Link to={"/route/createroute"}>
              <img className="bg-white rounded-full p-2" src={back} alt="" />
            </Link>
            <h2 className="text-2xl font-bold ms-1">View Route</h2>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => handleEdit(mainroute?._id)}
            className=" justify-between items-center font-[600] text-white gap-2 bg-[#820000]  flex px-5 py-2 shadow rounded-md"
          >
            <img src={vector} alt="" />
            <p>Edit</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="flex = items-center bg-gradient-to-r from-[#820000] to-[#2C353B] rounded-lg p-4  shadow">
          <div className="flex items-center justify-center w-12 h-12  rounded-full">
            <img src={car} alt="" />
          </div>
          <div className="ml-4">
            {" "}
            <div className="text-white">Most Visited Vehicle</div>
            <div className="text-lg text-white font-bold">
              {" "}
              {mostVisitedVehicle || "N/A"}
            </div>
          </div>
        </div>

        <div className="flex = items-center bg-gradient-to-r from-[#820000] to-[#2C353B] rounded-lg p-4  shadow">
          <div className="flex items-center justify-center w-12 h-12  rounded-full">
            <img src={user} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Most Visited Sales Man</div>
            <div className="text-lg text-white font-bold">
              {mostVisitedSalesman || "N/A"}
            </div>
          </div>
        </div>

        <div className="flex = items-center bg-gradient-to-r from-[#820000] to-[#2C353B] rounded-lg p-4  shadow">
          <div className="flex items-center justify-center w-12 h-12  rounded-full">
            <img src={map} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Most Visited Sub Route</div>

            <div className="text-lg text-white font-bold">
              {mostVisitedSbRoute || "N/A"}
            </div>
          </div>
        </div>

        <div className="flex = items-center bg-gradient-to-r from-[#820000] to-[#2C353B] rounded-lg p-4  shadow">
          <div className="flex items-center justify-center w-12 h-12  rounded-full">
            <img src={bottle} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white"> Bottle Stock</div>

            <div className="text-lg text-white font-bold">
              {" "}
              {totalStock || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-7 mb-4">
        <button
          className={`w-[221px] font-bold p-2 rounded-lg flex items-center ${
            activeSection === "routeDetail"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("routeDetail")}
        >
          <img src={user2} alt="" className="mr-2" />
          Route Detail
        </button>
        <button
          className={`w-[221px] p-2 font-bold rounded-lg flex items-center ${
            activeSection === "rideHistory"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("rideHistory")}
        >
          <img src={history} alt="" className="mr-2" />
          Ride History
        </button>
        <button
          className={`w-[221px] p-2 font-bold rounded-lg flex items-center ${
            activeSection === "subRoute"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("subRoute")}
        >
          <img className="me-2" src={map1} alt="" /> Sub Route
        </button>
        <button
          className={`w-[221px] font-bold p-2  rounded-lg flex items-center ${
            activeSection === "currentStock"
              ? "bg-[#E3E6D5] text-black"
              : "bg-white"
          }`}
          onClick={() => setActiveSection("currentStock")}
        >
          <img src={dollar} alt="" className="mr-2" />
          Current Stock
        </button>
      </div>

      {/* Conditional rendering based on the active section */}
      {activeSection === "routeDetail" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Main Route</p>
              <p>{mainroute?.mainRoute || "N/A"}</p>
            </div>

            <div>
              <p className="font-semibold">Main Route Code</p>
              <p> {mainroute?.routeCode || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p>{mainroute?.description || "No description provided"}</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === "rideHistory" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="absolute ml-3 ">
              <img src={search} alt="search" className="h-5 w-5" />
            </div>
            <input
              className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.04)",
                outline: "none",
                boxShadow: "none",
              }}
              placeholder="Search Ride"
              value={searchTerm} // Bind search input to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
            />
          </div>
          <table className="w-full text-left">
            <thead className=" bg-[#fdf8f0]">
              <tr className="border-b">
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sl No
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Date
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sales Man
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Driver
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Vehicle
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Main Route
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sub Route
                </th>

                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Stock
                </th>
                <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Sold
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRides.length > 0 ? (
                filteredRides.map((ride, index) => (
                  <tr className="border-b" key={ride._id}>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {index + 1}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.createdAt
                        ? new Date(ride.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.salesMan}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.driver}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.vehicleNo}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.mainRoute}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.subRoute}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.stock}
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {ride.sold || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center p-4 text-gray-500">
                    No Ride History available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "subRoute" && (
        <div className="">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="absolute ml-3 ">
                <img src={search} alt="search" className="h-5 w-5" />
              </div>
              <input
                className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.04)",
                  outline: "none",
                  boxShadow: "none",
                }}
                placeholder="Search Sub Route"
                value={searchTerms} // Bind search input to state
                onChange={(e) => setSearchTerms(e.target.value)} // Update searchTerm on input change
              />
            </div>
            <table className="w-full text-left">
              <thead className=" bg-[#fdf8f0]">
                <tr className="border-b">
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sl No
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sub Route
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sub Route Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((subroute, index) => (
                    <tr className="border-b" key={subroute._id}>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {index + 1}
                      </td>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {subroute.subRoute || "N/A"}
                      </td>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {subroute.subrouteCode || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center p-4 text-gray-500">
                      No sub-routes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === "currentStock" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="font-semibold">No Current Stock </p>
        </div>
      )}
    </div>
  );
};

export default ViewRoute;
