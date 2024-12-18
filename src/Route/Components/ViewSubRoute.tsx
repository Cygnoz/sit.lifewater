import React, { useEffect, useState } from "react";
import back from "../../assets/images/backbutton.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
// import car from "../../assets/images/car-front.png";
// import user from "../../assets/images/user.png";
import user2 from "../../assets/images/user2.png";
// import bottle from "../../assets/images/bottlesvg.svg";
import history from "../../assets/images/history.png";
import dollar from "../../assets/images/badge-dollar-sign.png";
// import { getSubRouteByIdAPI } from "../../services/RouteAPI/subRouteAPI";
// import { getAllEndRidesAPI } from "../../services/RouteAPI/ActiveRoute";
// import search from "../../assets/images/search.svg";
import vector from "../../assets/images/Vector.svg";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";

// interface Ride {
//   _id: string;
//   endingKM: string;
//   travelledKM: string;
//   salesMan: string | null;
//   date?: string;
//   sold?: number;
//   driver: string;
//   vehicleNo: string;
//   mainRoute: string;
//   stock: string;
//   expenses: Array<{
//     remarks: string;
//     amount: string;
//     _id: string;
//   }>;
//   activeRouteId: string;
//   __v: number;
//   subRoute?: string; // Add subRoute if it's part of your data
// }

const ViewSubRoute: React.FC = () => {
  const { id } = useParams(); // Assumes route ID is passed as a URL parameter
  const [error, setError] = useState("");
  // const [subrouteData, setSubRouteData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("routeDetail");
  const [sData,setSData] = useState<any>(null)
  // const [mainRideList, setMainRideList] = useState<Ride[]>([]); // Explicitly type as Ride[]
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  // Subroute data
  // useEffect(() => {
  //   const fetchSubRouteData = async () => {
  //     try {
  //       const data = await getSubRouteByIdAPI(id as string);
  //       setSubRouteData(data);
  //       setRoute(subrouteData?.subRoute);
  //       console.log(route);

  //       console.log(data);
  //       console.log(subrouteData);
  //     } catch (err: any) {
  //       setError(err.message || "Failed to load subroute data");
  //     }
  //   };

  //   fetchSubRouteData();
  // }, [id]);





  const { request: getSubRoutes } = useApi("get", 4000)

  const getALLSubroute = async () => {
    try {
      const url = `${endpoints.view_A_SUBROUTE}/${id}`
      console.log(id);
      
      const { response, error } = await getSubRoutes(url)
      console.log("API RESPONSE :", response)
      
      if (!error && response) {
        setLoading(false)
        setSData(response.data)
        console.log(sData);
        console.log(loading);
      }
    } catch (error) {
      setError("An error occured")
      console.log(error)
    }
  }

  useEffect(() => {
    getALLSubroute()
  }, [])

  console.log(sData);
  

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
            onClick={() => handleEdit(sData?._id)}
            className=" justify-between items-center font-[600] text-white gap-2 bg-[#820000]  flex px-5 py-2 shadow rounded-md"
          >
            <img src={vector} alt="" />
            <p>Edit</p>
          </button>
        </div>
       
      </div>

      {/* Display route info cards if data is loaded */}
      {/* <div className="grid grid-cols-4 gap-4 mb-6">
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
      </div> */}

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
                {sData?.subRouteName || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Main Route</p>
              <p className="text-[#8F99A9]">
                {sData?.mainRouteName || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Sub Route Code</p>
              <p className="text-[#8F99A9]">
                {sData?.subrouteCode || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-semibold">Description</p>
              <p className="text-[#8F99A9]">
                {sData?.description || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}


{activeSection === "currentStock" && (
  <div className="bg-white p-6 rounded-lg shadow">
    {sData.stock && sData.stock.length > 0 ? (
      <div className="space-y-3">
        {sData.stock.map((item:any) => (
          <div 
            key={item.itemId} 
            className="flex justify-between items-center border-b p-2 last:border-b-0 bg-[#fdf8f0]"
          >
            <div>
              <p className="font-medium capitalize">{item.itemName}</p>
              {item.status && (
                <p className="text-sm text-gray-500">{item.status}</p>
              )}
            </div>
            <div className="font-semibold">
              Quantity: {item.quantity}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="font-semibold">No Current Stock</p>
    )}
  </div>
)}
    </div>
  );
};

export default ViewSubRoute;
