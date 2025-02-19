import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";
import back from "../../../assets/images/backbutton.svg";
import PurchaseTable from "../../../commoncomponents/Table/Table";

const ViewWStock: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stock, setStock] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { request: getAWstock } = useApi("get", 4001);

  const getOneWstock = async () => {
    try {
      const url = `${endpoints.GET_A_WAREHOUSE_STOCK}/${id}`;
      const { response, error } = await getAWstock(url);
      if (!error && response) {
        setStock(response.data?.data);
      }
    } catch (error) {
      setError("Failed to fetch stock details");
    }
  };

  useEffect(() => {
    getOneWstock();
  }, []);

  if (error) return <p>{error}</p>;
  if (!stock) return <p>Loading stock details...</p>;

  const columns = [
    { id: "itemName", label: "Item Name", visible: true },
    { id: "quantity", label: "Quantity", visible: true },
    { id: "costPrice", label: "Cost Price", visible: true },
    { id: "sellingPrice", label: "Selling Price", visible: true },
    { id: "amount", label: "Amount", visible: true },
  ];

  return (
    <div className="flex w-full">
      <div className="flex-1 mt-2 p-2 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          <div className="flex gap-2">
            <Link to="/warstock">
              <img className="bg-gray-200 rounded-full p-1.5" src={back} alt="Back" />
            </Link>
            <h1 className="text-[20px] font-[700] mb-6 text-[#303F58]">Purchase Details</h1>
          </div>
       

          <div className="grid grid-cols-2 gap-4 ">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Stock Information</p>
              <p className="text-sm text-gray-500 mt-4">Warehouse</p>
              <p className="font-semibold">{stock.warehouse || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Transfer Number</p>
              <p className="font-semibold">{stock.transferNumber || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Supplier Name</p>
              <p className="font-semibold">{stock.supplierName || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Payment Mode</p>
              <p className="font-semibold">{stock.paymentMode || "N/A"}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Financial Details</p>
              <p className="text-sm text-gray-500 mt-4">Total Amount</p>
              <p className="font-semibold">{stock.totalAmount || 0} AED</p>
              <p className="text-sm text-gray-500 mt-4">Paid Amount</p>
              <p className="font-semibold">{stock.paidAmount || 0} AED</p>
              <p className="text-sm text-gray-500 mt-4">Balance Amount</p>
              <p className="font-semibold">{stock.balanceAmount || 0} AED</p>
              <p className="text-sm text-gray-500 mt-4">Date</p>
              <p className="font-semibold">{new Date(stock.date).toLocaleDateString()}</p>
            </div>
          </div>

         
            <p className="font-semibold underline underline-offset-8 mb-3">Items</p>
          
              <PurchaseTable
                columns={columns}
                data={stock.items || []}
                searchPlaceholder="Search Items"
                loading={!stock.items}
                searchableFields={["itemName"]}
                showAction={false}
              />
            
          </div>
        </div>
      </div>
   
  );
};

export default ViewWStock;
