import React, { useContext, useEffect, useState } from 'react'
import shopping from '../../assets/shopping-bag_6948334 1.svg'
import packing from '../../assets/images/Group.svg'
import processing from '../../assets//images/packing_customer.svg'
import delivery from '../../assets/images/delivery-box.svg'
import plus from '../../assets/circle-plus.svg'
import printer from '../../assets/images/printer.svg'
import split from '../../assets/images/list-filter.svg'
import search from "../../assets/images/search.svg"
import { useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import Table from "../../commoncomponents/Table/Table"
import { endpoints } from '../../services/ApiEndpoint'
import useApi from '../../Hook/UseApi'
import { TableResponseContext } from '../../assets/Context/ContextShare'

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
  const [orders, setOrders]= useState<OrderDetails[]>([])
  // const [filteredOrder, setFilteredOrder] = useState<OrderDetails[]>([])
  const { loading, setLoading } = useContext(TableResponseContext)!
  const { request: getALLOrders } = useApi("get", 4001)
  const getALLOrderss = async () => {
    try {
      const url = `${endpoints.GET_ALL_ORDERS}`
      const { response, error } = await getALLOrders(url)
      console.log("API RESPONSE :",response)

      if (!error && response) {
        setLoading(false)
        setOrders(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getALLOrderss()
  }, [])

  const { request: deleteOrder } = useApi("delete", 4001);

  const handleDelete =async (id:string) => {
    try{
      const url =`${endpoints.DELETE_AN_ORDER}/${id}`;
      const { response, error } = await deleteOrder(url);
      getALLOrderss()
      if(!error && response){
        toast.success(response?.data.message);
      }
      console.log(response);
     
    }catch (error) {
      toast.error("Error occurred while deleting Order.");
    }

  }

  const [columns] = useState([
    { id: "customerName", label: "Customer Name", visible: true },
    { id: "mainRouteName", label: "Main Route", visible: true },
    { id: "subRouteName", label: "Subroute Name", visible: true },
    { id: "orderNumber", label: "Order Number", visible: true },
    { id: "salesman", label: "Salesman", visible: true },
  ]);


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
            <div className="bg-white p-5 mt-5 rounded-lg">
        <Table 
          columns={columns} 
          data={orders} 
          searchPlaceholder="Search Customer" 
          loading={loading.skeleton} 
          searchableFields={[ "subRouteName", "subrouteCode"]}
          onViewClick={handleView} // Add this prop
          // onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
      </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrder