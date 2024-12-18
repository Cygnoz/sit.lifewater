import { Link } from "react-router-dom";
import searchIcon from "../assets/images/search (2).svg";
import plusIcon from "../assets/images/pluscircle.svg";
import order from "../assets/images/order.png";
import { useContext, useEffect, useState } from "react";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import { AllOrderResponseContext } from "../Context/ContextShare";

type Props = {}

const Orders = ({ }: Props) => {
  const [orders, setOrders] = useState([])
  const {setOrderResponse} = useContext(AllOrderResponseContext)!
  const { request: getALLOrders } = useApi("get", 4001)
  const getALLOrderss = async () => {
    try {
      const url = `${endpoints.GET_ALL_ORDER}`
      const { response, error } = await getALLOrders(url)
      if (!error && response) {
        setOrders(response.data)
        console.log("API RESPONSE :", response.data)
        setOrderResponse(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getALLOrderss()
  }, [])

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className=" w-full max-w-md flex items-center justify-between px-4 mb-8">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Search Orders"
            className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none"
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
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <div className="bg-gradient-to-l from-[#E3E6D5] to-[#F7E7CE] my-3 p-5 rounded-xl" key={order.id || Math.random()}>
              <div className="flex justify-between">
                <div>
                  <p className="text-[#303F58]">Customer</p>
                  <p className="text-[#303F58] text-[16px] font-bold ms-1">{order.customerName || "NA"}</p>
                </div>
                <Link to={`/orders/${order._id}`}>
                <button  className="bg-[#F6F6F6] h-6 text-[13px] rounded-md px-3 border border-[#820000]">
                  View
                </button>
                </Link>
              </div>
              <p className="text-[#303F58] pt-1">Item</p>
              <p className="text-[#303F58] font-semibold ms-1">
                {order.stock.map((item: any) => item.itemName || "NA").join(", ")}
              </p>
              <div className="flex bg-[#FFFFFF] px-2 py-1 gap-2 mt-2 rounded-md items-center">
                <p className="text-[12px] text-[#303F58]">Payment Mode</p>
                <span className="h-3 w-[2px] bg-[#9EA9BB]"></span>
                <p className="text-[12px] text-[#303F58] font-bold">{order.paymentMode || "NA"}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center p-8 m-8">
            {/* Illustration Image */}
            <img src={order} alt="Illustration" className="w-64 object-cover mb-4" />
            {/* No Return Customers Text */}
            <span className="text-gray-500 text-sm">No Orders Found</span>
          </div>
        )}



      </div>

    </div>
  )
}

export default Orders