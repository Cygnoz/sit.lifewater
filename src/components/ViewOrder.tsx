import React, { useEffect, useState } from 'react';

import bottleside from '../assets/images/bottleside.png';
import printer from '../assets/images/printer.svg';
import lines2 from '../assets/images/lines2.svg';
import backbutton from '../assets/images/backbutton.svg';
import { Link, useParams } from 'react-router-dom';
import { viewOrderAPI } from '../services/OrderAPI/OrderAPI';
import { STOCK_BASEURL } from '../services/Baseurl';

const ViewOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultImage = "https://brandsmaterial.com/wp-content/uploads/2017/07/Order-Icon-01.png";
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await viewOrderAPI(id as string);
        setOrder(orderData);
      } catch (error) {
        setError("Failed to fetch order details.");
      }
    };
    fetchOrder();
  }, [id]);
console.log(order);

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
            <h2 className="text-xl font-bold">View Orders Details</h2>
          </div>

          {/* Order Info */}
          <div className="flex gap-3">
            <p className="text-sm text-gray-500 mt-2">Order# {order.orderNumber || "N/A"}</p>
            <img src={lines2} alt="" className="mt-2" />
            <div className="h-[25px] px-1.5 py-1 bg-[#f2f2f2] rounded inline-flex mt-1">
              <p className="text-[#4b5c79] text-sm font-semibold">{order.status || "Draft"}</p>
            </div>
          </div>
          <hr className="mt-2" />
          <p className="text-sm text-gray-500 mt-2">Purchase date: <span className="font-bold">{new Date(order.date).toLocaleDateString()}</span></p>

          {/* Items List */}
          {order.items && order.items.map((item: any, index: number) => (
            <div key={index} className="mt-6 bg-gradient-to-r from-[#e3e6d5] to-[#f7e7ce] rounded-lg flex justify-between items-center p-3">
              <div className="flex items-center gap-4">
              <img 
  className="mx-auto object-cover w-[80px] h-[80px] rounded-full"
  src={item.itemImage ? `${STOCK_BASEURL}/${item.itemImage.replace(/\\/g, '/')}` : defaultImage} 
  alt={`${item.itemName}`} />

                <div>
                  <p className="text-sm text-gray-500">Item</p>
                  <p className="font-semibold">{item.itemName}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity} PCS</p>
                  <p className="text-sm text-gray-500">Rate: Rs. {item.price}</p>
                  <p className="font-semibold text-lg">Amount: Rs. {item.amount}</p>
                </div>
              </div>
              <img src={bottleside} alt="" className="w-12 h-12" />
            </div>
          ))}

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">Purchased By</p>
              <p className="text-sm text-gray-500 mt-2">{order.customer || "N/A"}</p>
              <p className="font-semibold mt-4">Delivered By</p>
              <p className="text-sm text-gray-500">{order.salesman || "N/A"}</p>
              <p className="text-sm text-gray-500">Vehicle no: {order.vehicleNo || "N/A"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">Order Summary</p>
              <p className="text-sm text-gray-500 mt-2">Untaxed Amount: Rs. {order.untaxedAmount || "0.00"}</p>
              <p className="text-sm text-gray-500">SGST: Rs. {order.sgst || "0.00"}</p>
              <p className="text-sm text-gray-500">CGST: Rs. {order.cgst || "0.00"}</p>
              <p className="font-semibold text-lg mt-4">Total: Rs. {order.totalAmount || "0.00"}</p>
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

export default ViewOrder;
