import React, { useEffect, useState } from "react";

import bottleside from "../../assets/images/bottleside.png";

import backbutton from "../../assets/images/backbutton.svg";
import { Link, useParams } from "react-router-dom";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

const ViewOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { request: getAnOrder } = useApi("get", 4001);

  const getOneOrder = async () => {
    try {
      const url = `${endpoints.GET_AN_ORDER}/${id}`;
      const { response, error } = await getAnOrder(url);
      console.log(response);
      console.log("apii :", response);
      if (!error && response) {
        setOrder(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOneOrder();
  }, []);
  console.log(order);
  console.log(setError);

  if (error) return <p>{error}</p>;
  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="flex  w-full">
      <div className="flex-1 mt-2 p-2  overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          {/* Header */}
          <div className="flex gap-3 items-center">
            <Link to="/orders">
              <button className="h-10 px-2.5 bg-[#f6f6f6] rounded-[56px]">
                <img src={backbutton} alt="Back" />
              </button>
            </Link>
            <h2 className="text-xl font-bold">Orders Details</h2>
          </div>

          {/* Order Info */}
          <div className="flex gap-3">
            <p className="text-sm text-gray-500 mt-2 ">
              Order# :{" "}
              <span className="font-bold">{order.orderNumber || "N/A"}</span>
            </p>
          </div>
          <hr className="mt-2" />
          <p className="text-sm text-gray-500 mt-2">
            Order date:{" "}
            <span className="font-bold">
              {new Date(order.date).toLocaleDateString("en-GB")}{" "}
              {new Date(order.date).toLocaleTimeString()}
            </span>
          </p>

          {/* Items List */}
          {order.stock &&
            order.stock.map((item: any, index: number) => (
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
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold"> {item.status}</p>
                  </div>
                </div>
                <img src={bottleside} alt="" className="w-12 h-12" />
              </div>
            ))}

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
         
            <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold underline underline-offset-8">Order Details</p>
              <p className="text-sm text-gray-500 mt-4">Ordered By</p>
              <p className="font-semibold">{order.customerName || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Delivered By</p>
              <p className="font-semibold ">{order.salesman || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Mobile number</p>
              <p className="font-semibold ">{order.customerMobile || "N/A"}</p>
              <div className="">
                <p className="text-sm text-gray-500 mt-4">
                 Main Route : <span className="font-semibold text-black"> {order.mainRouteName || "N/A"}</span>
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  Sub Route : <span className="font-semibold text-black">{order.subRouteName || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* paymentMode === Cash  */}
            {/* Render payment details only if paymentMode is "Cash" */}

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Sale Invoice</p>
              <p className="text-sm text-gray-500 mt-4">Payment Mode </p>
              <p className="font-semibold ">{order.paymentMode || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4 mb-1">Total Amount</p>
              <p className="font-semibold">
                {`${order.totalAmount} AED` || "N/A"}
              </p>
             
                <>
                  {" "}
                  <p className="text-sm text-gray-500 mt-4 mb-1">
                    Amount Paid{" "}
                  </p>
                  <p className="font-semibold ">
                    {`${order.paidAmount} AED` || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mt-4 mb-1">
                    Balance Amount
                  </p>
                  <p className="font-semibold ">
                    {`${order.balanceAmount} AED` || "N/A"}
                  </p>
                </>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
