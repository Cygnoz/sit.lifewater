import React, { useEffect, useState } from "react";

import printer from "../../../assets/images/printer.svg";
import backbutton from "../../../assets/images/backbutton.svg";
import { Link, useParams } from "react-router-dom";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";

const ViewWarehouse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [warehouse, setWarehouse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { request: getAWarehouse } = useApi("get", 4001);

  const getOneWarehouse = async () => {
    try {
      const url = `${endpoints.GET_A_WAREHOUSE}/${id}`;
      const { response, error } = await getAWarehouse(url);
      console.log(response);
      if (!error && response) {
        setWarehouse(response.data.warehouse);
        console.log("warehouse details :", response.data.warehouse);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOneWarehouse();
  }, []);
  console.log(warehouse);
  console.log(setError);

  if (error) return <p>{error}</p>;
  if (!warehouse) return <p>Loading warehouse details...</p>;

  return (
    <div className="flex  w-full">
      <div className="flex-1 mt-2 p-2  overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          {/* Header */}
          <div className="flex gap-3 items-center">
            <Link to="/warehouse">
              <button className="h-10 px-2.5 bg-[#f6f6f6] rounded-[56px]">
                <img src={backbutton} alt="Back" />
              </button>
            </Link>
            <h2 className="text-xl font-bold">View Warehouse Details</h2>
          </div>
          <hr className="mt-2" />
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-bold">{warehouse.warehouseName}</span>
          </p>
          {warehouse.stock &&
            warehouse.stock.map((item: any, index: number) => (
              <div
                key={index}
                className="mt-6 bg-gradient-to-r from-[#e3e6d5] to-[#f7e7ce] rounded-lg flex justify-between items-center p-3"
              >
                <div className="flex items-center gap-10">
                  <div>
                    <p className="text-sm text-gray-500">Item</p>
                    <p className="font-semibold">{item.itemName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-semibold"> {item.quantity} Pcs</p>
                  </div>
                </div>
              </div>
            ))}

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mt-4">Address</p>
              <p className="font-semibold">{warehouse.address || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Delivered By</p>
              <p className="font-semibold ">{warehouse.salesman || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Mobile number</p>
              <p className="font-semibold ">{warehouse.contactNo || "N/A"}</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-gray-200 text-black rounded-lg flex items-center gap-2">
              <img src={printer} alt="Print" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewWarehouse;
