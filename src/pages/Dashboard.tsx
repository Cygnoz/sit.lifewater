import React, { useEffect, useState } from 'react';
import useApi from '../Hook/UseApi';
import { endpoints } from '../services/ApiEndpoint';
import frame from "../assets/images/Frame 629279.svg";
import stocklimit from "../assets/images/Icons/stock1.svg";
import empty from "../assets/images/Icons/empty1.svg";
import cash from "../assets/images/Icons/cashicon.svg";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rideId, setRideId] = useState(null);
  const [receiptAmount, setReceiptAmount] = useState(Number);
  const [orderAmount, setOrderAmount] = useState(Number);
  const [totStock, setTotStock] = useState(Number);
  const [emptyBottle, setEmptyBottle] = useState(Number);
  const [subRouteId, setSubRouteId] = useState(null);
  const [cashCount, setCashCount] = useState<number>(0);
  const [creditCount, setCreditCount] = useState<number>(0);
  const [totalAmountSum, setTotalAmountSum] = useState<number>(0);
  console.log(loading);
  const { request: GetAllReceip } = useApi("get", 4001);

  const GetAllReceiptBySalemanId = async () => {
    try {
      const url = `${endpoints.GET_ALL_RECEIPT_BY_SALESMANID}/${SalesManId}`;
      const { response, error } = await GetAllReceip(url);
      console.log("Get All Receipt By sales id:", response?.data?.data);

      if (!error && response) {
        // Calculate the total paidAmount
        const totalPaidAmount = response?.data?.data.reduce((acc: number, item: any) => acc + (item?.paidAmount || 0), 0);
        // Set the total in state
        setReceiptAmount(totalPaidAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        }
        setSubRouteId(activeRide?.subRouteId)
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch ride orders only when `rideId` is updated
  useEffect(() => {
    if (rideId) {
      getOrders();
    }
  }, [rideId]);

  const { request: getRideOrders } = useApi("get", 4001);
  const getOrders = async () => {
    if (!rideId) return; // Prevent API call if rideId is null
    setLoading(true);
    try {
      const url = `${endpoints.RIDE_ORDERS}/${rideId}`;
      const { response, error } = await getRideOrders(url);

      if (!error && response) {

        console.log("Ride Orders:", response);
        const totalPaidAmount = response?.data?.data.reduce((acc: number, item: any) => acc + (item?.paidAmount || 0), 0);
        // Set the total in state
        setOrderAmount(totalPaidAmount);
        let cash = 0,
          credit = 0,
          totalAmount = 0;
        response?.data?.data.forEach((order: any) => {
          if (order.paymentMode === "Cash") cash++;
          else if (order.paymentMode === "Credit") credit++;
          totalAmount += order.totalAmount;
        });
        setCashCount(cash);
        setCreditCount(credit);
        setTotalAmountSum(totalAmount);
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
        const totalStock = response?.data?.stock.reduce((acc: number, item: any) => acc + (item?.quantity || 0), 0);
        const totalEmptyBottle = response?.data?.stock.reduce((acc: number, item: any) => acc + (item?.returnBottle || 0), 0);
        setTotStock(totalStock)
        setEmptyBottle(totalEmptyBottle)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  // Fetch active route on component mount
  useEffect(() => {
    fetchActiveRoute();
    GetAllReceiptBySalemanId();
  }, []);

  const CashInHand = (receiptAmount + orderAmount) || 0;
  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
        <div className="flex gap-3">
          <div className="w-1/3 p-2 bg-white rounded-xl shadow">
            <img src={stocklimit} alt="" width={40} />
            <h2 className="text-xl font-bold text-[#820000] mt-2">{totStock || 0} </h2>
            <p className="text-gray-600 font-semibold"> Stock Balance</p>
          </div>
          <div className="w-1/3 p-2 bg-white rounded-xl shadow">
            <img src={empty} alt="" width={40} />
            <h2 className="text-xl font-bold text-[#820000] mt-2">{emptyBottle || 0} </h2>
            <p className="text-gray-600 font-semibold">Empty Bottles</p>
          </div>
          <div className="w-1/3 p-2 bg-white rounded-xl shadow">
            <img src={frame} alt="" width={40} />
            <h2 className="text-xl font-bold text-[#820000] mt-2">{CashInHand || 0}   AED </h2>
            <p className="text-gray-600 font-semibold">Cash In Hand</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg">
          <div className="p-4 bg-[#F5F6FA] rounded shadow flex gap-5">
            <div>
              <img src={cash} className='mt-1' alt="" />
            </div>
            <div>
              <p className="  text-xl font-bold text-[#820000] mt-2]">{cashCount || 0}</p>
              <h2 className="text-[#787A7D] font-bold text-[15px]">Cash Sale</h2>
            </div>
          </div>
          <div className="p-4 bg-[#F5F6FA] rounded shadow flex gap-5 my-5">
            <div>
              <img src={cash} className='mt-1' alt="" />
            </div>
            <div>
              <p className="  text-xl font-bold text-[#820000] mt-2]">{creditCount || 0} </p>
              <h2 className="text-[#787A7D] font-bold text-[15px]">Credit Sale</h2>
            </div>
          </div>  <div className="p-4 bg-[#F5F6FA] rounded shadow flex gap-5">
            <div>
              <img src={cash} className='mt-1' alt="" />
            </div>
            <div>
              <p className="  text-xl font-bold text-[#820000] mt-2]">{totalAmountSum || 0} AED</p>
              <h2 className="text-[#787A7D] font-bold text-[15px]">Total Sale Amount</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
