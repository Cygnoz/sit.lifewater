import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../services/ApiEndpoint";

import useApi from "../../Hook/UseApi";
import { TableResponseContext } from "../../assets/Context/ContextShare";
import Table from "../../commoncomponents/Table/Table"

const Receipt: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders]= useState([])
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


  const filteredOrders = orders.filter(
    (order) => order.paymentMode  === "Cash" && order.balanceAmount > 0
  );
  
console.log("Filtered Orders:", filteredOrders);

  // Define columns for the table
  const columns = [
    { id: "date", label: "Date", visible: true },
    { id: "orderNumber", label: "Number", visible: true },
    { id: "customerName", label: "Customer Name", visible: true },
    { id: "totalAmount", label: "Total Amount", visible: true },
    { id: "paidAmount", label: "Amount Received", visible: true },
    { id: "balanceAmount", label: "Balance Amount", visible: true },
  ];

  // Handle row click
  const handleRowClick = (id: string) => {
    navigate(`/viewreceipt/${id}`);
  };

  // Handle view action
  const handleView = (id: string) => {
    navigate(`/viewreceipt/${id}`);
  };

  // Handle edit action
  const handleEdit = (id: string) => {
    navigate(`/editreceipt/${id}`);
  };

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "date") {
      return (
        <div className="flex justify-center text-center items-center">
          {new Date(item.date).toLocaleDateString("en-GB")}{" "}
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
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
      <Table 
          columns={columns} 
          data={filteredOrders} 
          searchPlaceholder="Search Customer" 
          loading={loading.skeleton} 
          searchableFields={[ "subRouteName", "subrouteCode"]}
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