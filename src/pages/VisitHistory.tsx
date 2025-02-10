import React, { useEffect, useState } from 'react';
import rupee from '../assets/images/rupees.svg';
import handcoin from '../assets/images/handcoin.svg';
import user from '../assets/images/Icons/user-round1.svg';
import search from '../assets/images/search (2).svg';
import { endpoints } from '../services/ApiEndpoint';
import useApi from '../Hook/UseApi';

interface OrderDetails {
  date: string
}

const Visithistory: React.FC = () => {
  const [subRote, setSubRote] = useState("");
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rideId, setRideId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (subRote) {
      getALLCustomersBySubRoute(subRote);
    }
  }, [subRote]);

  // Fetch activeroute with sales id
  const { request: getActiveRoute } = useApi("get", 4000);
  const SalesManId = localStorage.getItem("SalesManId");
  const fetchActiveRoute = async () => {
    try {
      const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
      const { response, error } = await getActiveRoute(url);
      console.log("Active route with sales id:", response?.data?.activeRide);

      if (!error && response) {
        const activeRide = response?.data?.activeRide;
        if (activeRide) {
          setRideId(activeRide?._id); // Set rideId correctly
          setSubRote(activeRide.subRouteName)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch ride orders only when `rideId` is updated
  useEffect(() => {
    if (rideId && subRote) {
      getOrders();
    }
  }, [rideId ,subRote]);

  const { request: getRideOrders } = useApi("get", 4001);
  const getOrders = async () => {
    if (!rideId) return; // Prevent API call if rideId is null
    setLoading(true);
    try {
      const url = `${endpoints.RIDE_ORDERS}/${rideId}`;
      const { response, error } = await getRideOrders(url);

      if (!error && response) {
        const OrderDetails = response?.data?.data.sort(
          (a: OrderDetails, b: OrderDetails) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setOrders(OrderDetails);
        console.log("Ride Orders:", response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const { request: getAllSubRouteCustomers } = useApi("get", 4000);
  // Get All customer in the subroute
  const getALLCustomersBySubRoute = async (subRoute: any) => {
    if (!subRoute) return; // Prevent API call if subRoute is undefined

    setLoading(true);
    try {
      const url = `${endpoints.GET_CUSTOMER_BY_SUBROUTE}/${subRoute}`;
      const { response, error } = await getAllSubRouteCustomers(url);
      console.log("Get all customer in SubRoute", response);

      if (!error && response) {
        setCustomers(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active route on component mount
  useEffect(() => {
    fetchActiveRoute();
  }, []);

  // Filter orders based on searchTerm
  const filteredOrders = orders.filter((order: any) =>
    [order.customerName, order.orderNumber, order.paymentMode].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen w-full max-w-screen-xl mx-auto bg-gray-100 p-4"

    >
      {/* First Row: Search Bar with Filter Icon */}
      <div className="relative w-full flex items-center">

        <input
          type="text"
          placeholder="Search History"
          className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <img src={search} alt="Search Icon" className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Second Row: Three Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Visited Customers Card */}
        <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-xs">
          {/* Icon with custom red circular background */}
          <div className="mb-2 flex items-center justify-center w-12 h-12" style={{ backgroundColor: '#820000', borderRadius: '50%' }}>
            <img src={rupee} alt="Visited Icon" className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-medium text-[#820000]">{filteredOrders.length || "N/A"}</h2>
          <p className="font-bold text-[#787A7D] text-sm">Visited Customers</p>
        </div>

        {/* Total Customers Card */}
        <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-xs">
          {/* Icon with custom red circular background */}
          <div className="mb-2 flex items-center justify-center w-12 h-12" style={{ backgroundColor: '#820000', borderRadius: '50%' }}>
            <img src={handcoin} alt="Total Customers Icon" className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-medium text-[#820000]">{customers.length || "N/A"}</h2>
          <p className="font-bold text-[#787A7D]  text-sm">Total Customers</p>
        </div>
      </div>

      {/* Third and Fourth Row: Large Customer Cards */}
      <div className="mt-6 space-y-4">
        {
          loading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) :
            (
              filteredOrders.length > 0 ?
                filteredOrders.map((data: any) => (
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
                    {/* Image and Name */}
                    <div className="flex items-center">
                      <img src={user} alt="" className="bg-[#CEEFDF] text-[#787A7D] rounded-full p-2 text- w-10 h-10" /> {/* Adjust image size for mobile */}
                      <div className="ml-4">
                        <h3 className="font-medium text-[#484A4D] text-sm md:text-base">{data.customerName || "N/A"}</h3> {/* Adjust font size */}
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="space-x-1 space-y-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-[#CEEFDF] text-[#0AAF60] rounded-xl flex items-center">
                        Delivered
                      </span>
                    </div>
                  </div>
                ))
                :
                (
                  <div>
                    No History Fond
                  </div>
                )
            )
        }


      </div>
    </div>
  );
};

export default Visithistory;
