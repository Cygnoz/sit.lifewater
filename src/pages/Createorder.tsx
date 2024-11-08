import React, { useEffect, useState } from 'react'
import shopping from '../assets/shopping-bag_6948334 1.svg'
import packing from '../assets/images/Group.svg'
import processing from '../assets//images/packing_customer.svg'
import delivery from '../assets/images/delivery-box.svg'
import plus from '../assets/circle-plus.svg'
import eye from '../assets/images/eye.svg'
import printer from '../assets/images/printer.svg'
import trash from '../assets/images/trash.svg'
import split from '../assets/images/list-filter.svg'
import search from "../assets/images/search.svg"


import { useNavigate } from 'react-router-dom'
import { deleteOrderAPI, getOrderAPI } from '../services/OrderAPI/OrderAPI'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";

interface Item {
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface OrderDetails {
  _id: string;
 
  customer: string;
salesman: string;
warehouse:string,
date: string;
orderNumber: string;
paymentMode: string;
items: Item[];
notes: string;
termsAndCondition: string;
}

const CreateOrder: React.FC = () => {
  const navigate = useNavigate()

  const handleCreate = (): void => {
    navigate('/addneworder')
  }

  const handleView = (id : string): void => {
    navigate(`/vieworder/${id}`)
  }

  // const [orders, setOrders] = useState<ApiResponse[]>([]); // State to store order data
  
  // useEffect(() => {
  //   // Fetch all orders on component mount
  //   const fetchOrders = async () => {
  //     try {
  //       const data = await getOrderAPI();
  //       setOrders(data); // Set the fetched data to the orders state
  //     } catch (error) {
  //       console.error("Failed to fetch orders:", error);
  //     }
  //   };
  //   fetchOrders();
  // }, []);


  const [orders, setOrders]= useState<OrderDetails[]>([])
  // const [filteredOrder, setFilteredOrder] = useState<OrderDetails[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrderAPI();
        console.log("Full API Response:", response); // Check the response
        setOrders(response); // Store full staff list
        // setFilteredOrder(response)
      } catch (error:any) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrderAPI(id);
      // Remove the deleted order from the local state
      setOrders(orders.filter((order) => order._id!== id));
      toast.success('Order deleted successfully')
      // alert("Order deleted successfully");
    } catch (error) {
      // alert("Failed to delete order");
      toast.error('Failed to delete order')
    }
  };


  // const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   // Fetch orders when component mounts
  //   const fetchOrders = async () => {
  //     try {
  //       const ordersData = await getOrderAPI();
  //       setOrders(ordersData.data);
  //     } catch (error) {
  //       console.error("Error fetching orders:", error);
  //     }
  //   };

  //   fetchOrders();
  // }, []);


  return (
    <div className="flex min-h-screen w-full">
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

      
      <div>
        <div className="p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">Create Order</h3>
              <p className='text-[#4B5C79]' >Lorem ipsum dolor sit amet consectetur </p>           
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCreate}
                className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md"
              >
                <img src={plus} alt="" />
                <p>New Order</p>
              </button>
             
            </div>
          </div>
          {/* Cards Section */}
          <div className="grid grid-cols-4 gap-4 my-6">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={shopping} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Cash Sale</div>  
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit amet consectetur </p>           
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">120</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={packing} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Credit Sale</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit amet consectetur </p>           

              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">100</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={processing} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Sold Item</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit amet consectetur </p>           
              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">10</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={delivery} alt="" />
              <div className=" font-bold leading-normal text-[#303F58] text-[17px] mt-2">Revenue</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit amet consectetur </p>           
              <div className=" text-[#820000] font-bold leading-normal text-[18px] mt-3">12</div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
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
                placeholder="Search Order"
                 
              />
              <div className="flex w-[60%] justify-end">
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                  <img className="mt-1 me-1" src={split} alt="" />
                  Sort By
                </button>
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
                  <img className="mt-1 me-1" src={printer} alt="" />
                  Print
                </button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className=' bg-[#fdf8f0]'>
                <tr className="border-b">
                <th className="p-2 text-[12px] text-center text-[#303F58] w-16"> <input type="checkbox" /></th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Date</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Order No</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Customer Name</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Item</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Amount</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Salesman</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order,index)=>(
                                  <tr className="border-b">
                                  <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{index + 1}</td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{order.date.split('T')[0]}</td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{order.orderNumber}</td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{order.customer}</td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{order.items.map((item)=>(item.itemName))}</td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{order.items.map((item)=>(item.amount))}</td>
                                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{order.salesman}</td>
                                    <td className="p-2 text-[14] text-center">
                                    <button onClick={()=> handleView (order._id)} className="text-blue-500">
                                        <img src={eye} alt="" />
                                      </button>
                                      <button onClick={() => handleDelete(order._id)} className="text-red-500 ml-2"><img src={trash} alt="" /></button>
                  
                                    </td>
                                  </tr>
                  
                ))}
                {/* <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">15 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">INV-44</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">John Doe</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">9092333300</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Water Dispenser</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">20</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Joey</td>
                  <td className="p-2 text-[14] text-center">
                  <button onClick={handleView} className="text-blue-500">
                      <img src={eye} alt="" />
                    </button>
                    <button className="text-red-500 ml-2"><img src={trash} alt="" /></button>

                  </td>
                </tr> */}
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrder
