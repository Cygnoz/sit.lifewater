import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import car from "../../assets/images/car-front.png";
import user from "../../assets/images/user.png";
import user2 from "../../assets/images/user2.png";
import bottle from "../../assets/images/bottlesvg.svg";
import history from "../../assets/images/history.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
import { getSubRouteByIdAPI } from "../../services/RouteAPI/subRouteAPI";
import { getAllEndRidesAPI } from "../../services/RouteAPI/ActiveRoute";
import search from "../../assets/images/search.svg";
import vector from "../../assets/images/Vector.svg";

interface Ride {
  _id: string;
  endingKM: string;
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

const ViewSubRoute: React.FC = () => {
  const { id } = useParams(); // Assumes route ID is passed as a URL parameter
  const [error, setError] = useState("");
  const [subrouteData, setSubRouteData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("routeDetail");
  const [route, setRoute] = useState<any>(null);
  const [rides, setRides] = useState<Ride[]>([]); // Explicitly type as Ride[]
  const [mostVisitedSalesman, setMostVisitedSalesman] = useState<string | null>(
    null
  );
  const [mostVisitedVehicle, setMostVisitedVehicle] = useState<string | null>(
    null
  );
  const [mainRideList, setMainRideList] = useState<Ride[]>([]); // Explicitly type as Ride[]
  const navigate = useNavigate();

  // Subroute data
  useEffect(() => {
    const fetchSubRouteData = async () => {
      try {
        const data = await getSubRouteByIdAPI(id as string);
        setSubRouteData(data);
        setRoute(subrouteData?.subRoute);
        console.log(route);

        console.log(data);
        console.log(subrouteData);
      } catch (err: any) {
        setError(err.message || "Failed to load subroute data");
      }
    };

    fetchSubRouteData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const targetSubRoute = subrouteData?.subRoute;
        if (!targetSubRoute) {
          console.warn("Main route is undefined");
          return;
        }

        const data: { data: Ride[] } = await getAllEndRidesAPI();
        setRides(data.data); // Set the full list of rides
        console.log(rides);

        // Filter rides by the specified main route
        const filteredRides = data.data.filter(
          (ride: Ride) => ride.subRoute === targetSubRoute // Type annotation for ride
        );

        if (filteredRides.length === 0) {
          console.warn(`No rides found for main route: ${targetSubRoute}`);
          setMostVisitedSalesman(null);
          setMostVisitedVehicle(null);
          return;
        }

        // Count occurrences of each salesMan, vehicleNo, and subRoute within the filtered rides
        const salesCount: Record<string, number> = {};
        const vehicleCount: Record<string, number> = {};
        const subRouteCount: Record<string, number> = {};

        filteredRides.forEach((ride: Ride) => {
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

        setMostVisitedSalesman(mostFrequentSalesman);
        setMostVisitedVehicle(mostFrequentVehicle);

        console.log(
          `Most visited salesman in ${targetSubRoute}: ${mostFrequentSalesman}`
        );
        console.log(
          `Most visited vehicle in ${targetSubRoute}: ${mostFrequentVehicle}`
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
        // Call API to fetch rides data
        const response = await getAllEndRidesAPI();

        // Determine if response has data property or is directly an array
        const routes = Array.isArray(response.data) ? response.data : response;

        setRides(routes); // Set the full list of routes
        console.log("All Routes:", routes);

        // Ensure that `routeData` is loaded before filtering
        if (!subrouteData?.subRoute) {
          console.warn("Subroute is undefined");
          return;
        }

        // Get main route from routeData
        const Route = subrouteData?.subRoute;

        // Filter routes based on specified main route
        const filteredRoutes = routes.filter(
          (ride: Ride) => ride.subRoute === Route // Type annotation for ride
        );
        console.log("Filtered Routes for", Route, ":", filteredRoutes);

        setMainRideList(filteredRoutes); // Update state with filtered routes
      } catch (error) {
        console.error("Error fetching main route data:", error);
      }
    };

    fetchRide();
  }, [subrouteData?.subRoute]); // Add dependency on `routeData.mainRoute.mainRoute`

  const handleEdit = (id: string): void => {
    navigate(`/route/editsubroute/${id}`);
  };

  



  return (
    <div className="px-6 py-3">
      {/* Back Button and Title */}
      <div className="flex justify-between gap-3 items-center w-full max-w-8xl mb-2 ">
        
          <div className="icon-placeholder flex">
          <Link to={"/route/subroute"}>
            <img className="bg-[#ffff] rounded-full p-2" src={back} alt="" />
            </Link>
            <h2 className="text-2xl font-bold ms-1">View Sub Route</h2>

            </div>
            <div className="flex justify-between">
          <button
            onClick={() => handleEdit(subrouteData?._id)}
            className=" justify-between items-center font-[600] text-white gap-2 bg-[#820000]  flex px-5 py-2 shadow rounded-md"
          >
            <img src={vector} alt="" />
            <p>Edit</p>
          </button>
        </div>
       
      </div>

      {/* Display route info cards if data is loaded */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B] rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={car} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Most Visited Vehicle</div>
            <div className="text-lg text-white font-bold">
              {" "}
              {mostVisitedVehicle || "N/A"}{" "}
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B]  rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={user} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Most Visited Salesman</div>
            <div className="text-lg text-white font-bold">
              {" "}
              {mostVisitedSalesman || "N/A"}
            </div>
          </div>
        </div>

        <div className="flex items-center bg-gradient-to-r from-[#820000] to-[#2C353B]  rounded-lg p-4 shadow">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <img src={bottle} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-white">Bottle Stock</div>
            <div className="text-lg text-white font-bold">
              N/A
            </div>
          </div>
        </div>
      </div>

      {/* Error message display */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Buttons for navigating sections */}
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
          className={`w-[221px] font-bold p-2 rounded-lg flex items-center ${
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

      {/* Section Content */}
      {activeSection === "routeDetail" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Sub Route</p>
              <p className="text-[#8F99A9]">
                {subrouteData?.subRoute || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Main Route</p>
              <p className="text-[#8F99A9]">
                {subrouteData?.mainRoute || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Sub Rote Code</p>
              <p className="text-[#8F99A9]">
                {subrouteData?.subrouteCode || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold">Description</p>
              <p className="text-[#8F99A9]">
                {subrouteData?.description || "N/A"}
              </p>
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
            {mainRideList.length > 0 ? (
              mainRideList.map((ride, index) => (
                <tr className="border-b" key={ride._id}>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {index + 1}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.date || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.salesMan || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.driver || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.vehicleNo || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.mainRoute || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.subRoute || "N/A"}
                  </td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    {ride.stock || "N/A"}
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

      {activeSection === "currentStock" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="font-semibold">No Current Stock </p>
        </div>
      )}
    </div>
  );
};

export default ViewSubRoute;
