import { useEffect, useState } from "react";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";
import { useParams } from "react-router-dom";

type Order = {
  _id: string;
  orderNumber: string;
  salesman: string;
  mainRouteName: string;
  subRouteName: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  customerName: string;
};

const OrderHistory = () => {
  const { id } = useParams(); // Get salesman ID from URL
  const [staffData, setStaffData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { request: getStaff } = useApi("get", 4000);
  const { request: getOrders } = useApi("get", 4001);

  // Fetch staff data
  const fetchStaffData = async () => {
    try {
      const url = `${endpoints.GET_AN_STAFF}/${id}`;
      const { response, error } = await getStaff(url);
      if (!error && response) {
        setStaffData(response.data);
        console.log("Staff Data:", response.data);
        
      }
    } catch (err) {
      setError("Error fetching staff data");
      console.error(err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const url = `${endpoints.GET_ALL_ORDERS}`;
      const { response, error } = await getOrders(url);
      if (!error && response) {
        setOrders(response.data);
        console.log("Orders Data:", response.data);
        
      }
    } catch (err) {
      setError("Error fetching orders");
      console.error(err);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchStaffData();
    fetchOrders();
  }, []);

  // Filter orders when staff data is available
  useEffect(() => {
    if (staffData && orders.length > 0) {
      const filtered = orders.filter(
        (order) => order.salesman === staffData.firstname
      );
      setFilteredOrders(filtered);
    }
  }, [staffData, orders]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  if (error) return <p className="text-red-500">{error}</p>;
  if (!staffData) return <p>Loading staff details...</p>;
  if (!orders.length) return <p>Loading order details...</p>;

  return (
    <div className="w-full mx-auto mb-5 pt-2 ps-5 pe-5 bg-white shadow-md rounded-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-[#303F58] mb-4">
          Order History for {staffData.firstname}
        </h2>

        {filteredOrders.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-[32px] text-[#303F58] font-[400]">
              No Order History Found
            </p>
            <p className="text-[16px] text-[#4B5C79] font-[300]">
              No orders found for {staffData.firstname}.
            </p>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-[#F9F7F0]">
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Order Number</th>
                  <th className="border p-2">Main Route</th>
                  <th className="border p-2">Sub Route</th>
                  <th className="border p-2">Total Amount</th>
                  <th className="border p-2">Paid Amount</th>
                  <th className="border p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order._id} className="border text-center">
                    <td className="border p-2">{order.customerName}</td>
                    <td className="border p-2">{order.orderNumber}</td>
                    <td className="border p-2">{order.mainRouteName}</td>
                    <td className="border p-2">{order.subRouteName}</td>
                    <td className="border p-2">{order.totalAmount}</td>
                    <td className="border p-2">{order.paidAmount}</td>
                    <td className="border p-2">{order.balanceAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1 ? "bg-gray-300" : "bg-[#820000] text-white"
                }`}
              >
                Previous
              </button>

              <p className="text-gray-700">
                Page {currentPage} of {totalPages}
              </p>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-[#820000] text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
