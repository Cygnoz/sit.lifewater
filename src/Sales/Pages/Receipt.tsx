import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { endpoints } from "../../services/ApiEndpoint";

import useApi from "../../Hook/UseApi";
import { TableResponseContext } from "../../assets/Context/ContextShare";
import Table from "../../commoncomponents/Table/Table"
import PlusCircle from "../../assets/icons/PlusCircle";


const Receipt: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders]= useState([])
  // const [filteredOrder, setFilteredOrder] = useState<OrderDetails[]>([])
  const { loading, setLoading } = useContext(TableResponseContext)!
  const { request: getALLOrders } = useApi("get", 4001)
  const getALLOrderss = async () => {
    try {
      const url = `${endpoints.GET_ALL_RECIEPT}`
      const { response, error } = await getALLOrders(url)
      console.log("API RESPONSE :",response)

      if (!error && response) {
        setLoading(false)
        setOrders(response.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getALLOrderss()
  }, [])



  // Define columns for the table
  const columns = [
    { id: "createdAt", label: "Date", visible: true },
    { id: "fullName", label: "Customer", visible: true },
    { id: "receiptNumber", label: "Receipt Number", visible: true },
    { id: "orderNumber", label: "Number", visible: true },
    { id: "paidAmount", label: "Amount Received", visible: true },

  ];

  // Handle row click
  // const handleRowClick = (id: string) => {
  //   navigate(`/viewreceipt/${id}`);
  // };

  // Handle view action
  const handleView = (id: string) => {
    navigate(`/receipts/${id}`);
  };

  // Handle edit action
  // const handleEdit = (id: string) => {
  //   navigate(`/editreceipt/${id}`);
  // };

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "createdAt") {
      return (
        <div className="flex justify-center text-center items-center">
          {new Date(item.createdAt).toLocaleDateString("en-GB")}{" "}
        </div>
      );
    }
    return item[colId as keyof typeof item];
  };
 

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Receipt</h3>
          <p className="text-[#4B5C79]">
            Lorem ipsum dolor sit amet consectetur commondo enim odio
          </p>
        </div>
        <div className="flex justify-between">
     
        <Link to={'/addreciept'}>
        <button
          className="justify-between items-center gap-2 bg-[#820000] text-white flex px-4 py-2 rounded-md"
        >
          <PlusCircle/>
          <p>New Reciept</p>
        </button>
        </Link>
       
      
       
          
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
      <Table 
          columns={columns} 
          data={orders} 
          searchPlaceholder="Search Customer" 
          loading={loading.skeleton} 
          searchableFields={[ "orderNumber", "receiptNumber","fullName"]}
          onViewClick={handleView} // Add this prop
          // onEditClick={handleEdit}
          // onDeleteClick={handleDelete}
          renderColumnContent={renderColumnContent}
        />
      </div>
    </div>
  );
};

export default Receipt;