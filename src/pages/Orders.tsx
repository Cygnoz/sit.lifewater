import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../assets/images/search (2).svg";
import plusIcon from "../assets/images/pluscircle.svg";
import order from "../assets/images/order.png";
import { useEffect, useState } from "react";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import ViewOrderModal from "./ViewOrderModal";
import { toast, ToastContainer } from "react-toastify";

type Props = {};

const Orders = ({ }: Props) => {
  const [orders, setOrders] = useState([]);
  // const { setOrderResponse } = useContext(AllOrderResponseContext)!
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  // const { request: getALLOrders } = useApi("get", 4001)
  const [rideId, setRideId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const getALLOrderss = async () => {
  //   setLoading(true);
  //   try {
  //     const url = `${endpoints.GET_ALL_ORDER}`
  //     const { response, error } = await getALLOrders(url)
  //     if (!error && response) {
  //       // setOrders(response.data)
  //       // console.log("API RESPONSE :", response.data)
  //       setOrderResponse(response.data)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // }

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
        }
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
        setOrders(response?.data?.data);
        console.log("Ride Orders:", response);
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
  }, []);

  // Filter orders based on searchTerm
  const filteredOrders = orders.filter((order: any) =>
    [order.customerName, order.orderNumber, order.paymentMode].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // };
  // Delete order function
  const { request: deleteOrder } = useApi("delete", 4001);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    setIsModalOpen(false);
    try {
      const url = `${endpoints.DELETE_AN_ORDER}/${deleteId}`;
      const { response, error } = await deleteOrder(url);
      if (!error && response) {
        toast.success(response?.data?.message);
        setOrders((prev) =>
          prev.filter((order: any) => order._id !== deleteId)
        );
      }
    } catch (error) {
      toast.error("Error occurred while deleting Order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 my-4">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-900 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" w-full max-w-md flex items-center justify-between px-4 mb-8">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Search Orders"
            className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img src={searchIcon} alt="Search Icon" className="w-4 h-4" />
          </div>
        </div>
        <Link to="/addorder">
          <img className="m-2" src={plusIcon} alt="Add Customer" width={30} />
        </Link>
      </div>
      <div>
        {loading ? (
          <div className="p-2 text-center text-gray-500">Loading...</div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <div
              className="bg-gradient-to-l from-[#E3E6D5] to-[#F7E7CE] my-3 p-5 rounded-xl"
              key={order.id || Math.random()}
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-[#303F58]  ">
                    <div className="flex text-[12px] gap-1">
                      <p>{new Date(order.date).toLocaleDateString("en-GB")}</p>

                      <p>
                        {new Date(order.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-[#303F58]">Customer</p>
                  </div>
                  <p className="text-[#303F58] text-[16px] font-bold ms-1">
                    {order.customerName || "NA"}
                  </p>
                </div>
                <div className="flex flex-col space-y-4">
                  <ViewOrderModal id={order._id} />

                  <button
                    onClick={() => {
                      navigate(`/editorder/${order?._id}`);
                    }}
                    className="bg-[#F6F6F6] h-6 w-12 text-[13px] hidden rounded-md border border-[#820000] "
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                {" "}
                <p className="text-[#303F58] pt-1">Item</p>
                <button
                  onClick={() => confirmDelete(order._id)}
                  className="bg-[#F6F6F6] h-6 w-12 hidden text-sm rounded-md border border-red-900 mt-3 p-1  items-center"
                >
                  Delete
                </button>
              </div>
              <p className="text-[#303F58] font-semibold ms-1">
                {order.stock.map((item: any) => item.itemName || "NA").join(", ")}  : {order.stock.map((item: any) => item.quantity || "NA").join(", ")}
              </p>
              <div className="flex bg-[#FFFFFF] px-2 py-1 gap-2 mt-2 rounded-md items-center">
                <p className="text-[12px] text-[#303F58]">Payment Mode</p>
                <span className="h-3 w-[2px] bg-[#9EA9BB]"></span>
                <p className="text-[12px] text-[#303F58] font-bold">
                  {order.paymentMode || "NA"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center p-8 m-8">
            {/* Illustration Image */}
            <img
              src={order}
              alt="Illustration"
              className="w-64 object-cover mb-4"
            />
            {/* No Return Customers Text */}
            <span className="text-gray-500 text-sm">No Orders Found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
