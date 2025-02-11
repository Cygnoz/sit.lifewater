import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import plus from "../assets/images/pluscircle.svg";
import search from "../assets/images/search (2).svg";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";

// Update Order interface to match the API response
interface Order {
  orderNumber: string;
  createdAt: string;
  receiptNumber: string; // receiptNumber is string in the response
  paidAmount: number;
  fullName: string;
  _id: string
}

const PaymentCollection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(10); // Items per page
  const { request: getALLOrders } = useApi("get", 4001);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const url = `${endpoints.GET_ALL_RECIEPT}`;
        const { response, error } = await getALLOrders(url);
        if (!error && response) {
          setOrders(response.data?.data); // Ensure the API response matches
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReceipt();
  }, []);

  // Filter orders by customer name or order number
  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate orders
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 gap-5 px-4">
        <div className="relative w-full sm:w-80 flex items-center">
          <input
            type="text"
            placeholder="Search by Customer or Order Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 w-full text-sm rounded-xl text-[#8F99A9] h-10 border border-gray-300 bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img src={search} alt="Search Icon" className="w-4 h-4" />
          </div>
        </div>
        <Link to="/creditcollection" className="flex items-center">
          <img className="w-10 h-10" src={plus} alt="Add" />
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl">
        <table className="border-collapse border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-[#fdf8f0] text-gray-600 text-left">
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Date</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Customer</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Order Number</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Receipt Number</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Paid Amount</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2"> Action</th>

            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.orderNumber} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">
                    {order.fullName}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">
                    {order.orderNumber}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">
                    {order.receiptNumber}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">
                    {order.paidAmount}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">

                    <Link to={`/edit-creditcollection/${order._id}`}>
                      <p>
                        edit
                      </p>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-600 mx-1"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md mx-1 ${currentPage === index + 1
                  ? "bg-red-800 text-white"
                  : "bg-gray-200 text-gray-600"
                }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-600 mx-1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCollection;
