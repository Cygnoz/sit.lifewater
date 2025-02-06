
import frame from "../assets/images/Frame 629279.svg";
import damage from "../assets/images/Frame 629278.svg";
import fram from "../assets/images/rupeeframe.svg";
import { useEffect, useState } from "react";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";

const Stock: React.FC = () => {

  const [subRouteId, setSubRouteId] = useState(null);
  const [subRouteStock, setSubRouteStock] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch activeroute with sales id
  const { request: getActiveRoute } = useApi("get", 4000);
  const SalesManId = localStorage.getItem("SalesManId");

  const fetchActiveRoute = async () => {
    setLoading(true); // Start loading
    try {
      const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
      const { response, error } = await getActiveRoute(url);
      if (!error && response) {
        const activeRide = response?.data?.activeRide;
        if (activeRide) {
          setSubRouteId(activeRide?.subRouteId)
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (subRouteId) {
      getAsubRoute();
    }
  }, [subRouteId]);

  const { request: getASubRoute } = useApi("get", 4000)
  const getAsubRoute = async () => {
    if (!subRouteId) return; // Prevent API call if rideId is null
    setLoading(true);
    try {
      const url = `${endpoints.VIEW_A_SUBROUTE}/${subRouteId}`;
      const { response, error } = await getASubRoute(url);
      console.log("get A subRoute Response :", response?.data?.stock);

      if (!error && response) {
        setSubRouteStock(response?.data?.stock);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchActiveRoute();
  }, []);

  return (

    <div className="bg-[#F5F6FA]  min-h-screen">

      <div className=" flex flex-col items-center justify-center ">
        {loading ? (
          <div className="text-center p-4">
            <p>Loading data, please wait...</p>
          </div>
        ) : (
          <div className="p-3 flex flex-col items-center justify-center">
            {/* Main Container */}
            <div className="w-full max-w-lg  p-4">
              {/* Top Section: Stock balance, Damage Stock, Internal Order */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Stock balance */}
                <div className="bg-[#FFFFFF] shadow p-3 rounded-lg items-center justify-center  flex flex-col ">
                  <span className=" rounded-full">
                    <img src={frame} alt="Icon" className="w-9 h-9 mb-1" />
                  </span>
                  <span className="text-3xl  font-bold text-left text-[#820000]">
                    {subRouteStock.length || 0} 
                  </span>

                  <span className="text-[11px] font-bold leading-[13.31px] text-[#787A7D] text-left">
                    Items In Hand
                  </span>
                </div>
                {/* Damage Stock */}
                <div className="bg-[#FFFFFF] shadow p-3 items-center justify-center rounded-lg flex flex-col ">
                  <span className="rounded-full">
                  <img src={frame} alt="Icon" className="w-9 h-9 mb-1" />
                  </span>
                  <span className="text-3xl  font-bold text-left text-[#820000]">
                    {
                      subRouteStock.map((stock:any)=>(
                        <span>
                          {
                            stock?.returnBottle || 0
                          }
                        </span>
                      ))
                    }
                  </span>
                  <span className="text-[11px] font-bold leading-[13.31px] text-left text-[#787A7D] ">
                    Empty Bottles 
                  </span>
                </div>
                {/* Internal Order */}
                {/* <div className="bg-[#FFFFFF] shadow p-3 rounded-lg flex flex-col ">
                  <span className="rounded-full">
                    <img src={fram} alt="Icon" className="w-9 h-9" />
                  </span>
                  <span className="text-3xl  font-bold text-left text-[#820000]">
                    -
                  </span>
                  <span className="text-[11px] font-bold leading-[13.31px] text-left text-[#787A7D] ">
                    Internal Order
                  </span>
                </div> */}
              </div>
              <div className="overflow-x-auto mt-5">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-[#fdf8f0]">
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                        Sl.No
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                        Item Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subRouteStock.length > 0 ? (
                      subRouteStock.map((item :any, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.itemName}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.quantity}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="border border-gray-300 px-4 py-2 text-center"
                          colSpan={3}
                        >
                          No Stock available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stock;
