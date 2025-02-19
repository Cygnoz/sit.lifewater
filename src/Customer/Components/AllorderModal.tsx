import React from "react";
import PurchaseTable from "../../commoncomponents/Table/Table";

interface StockItem {
  itemId: string;
  itemName: string;
  quantity: number;
  status: string;
  
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number | string;
  stock: StockItem[];
  customerName: string;
  paymentMode: string;
  paidAmount: number;
  
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: Order[];
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, orders = [] }) => {
  if (!isOpen) return null;

  const columns = [
    { id: "date", label: "Date", visible: true },
    { id: "orderNumber", label: "Order Number", visible: true },
    { id: "itemName", label: "Item Name", visible: true },
    { id: "quantity", label: "Quantity", visible: true },
    { id: "paymentMode", label: "Payment Mode", visible: true },
    { id: "paidAmount", label: "Amount Paid", visible: true },
    { id: "totalAmount", label: "Total", visible: true },
  ];

  const formattedData = orders.flatMap((order) =>
    order.stock.map((item) => ({
    customerName: order.customerName,
      date: new Date(order.date).toLocaleDateString(),
      orderNumber: order.orderNumber,
      paymentMode:order.paymentMode,
      paidAmount:order.paidAmount,
      itemName: item.itemName,
      quantity: item.quantity,
       
      status: item.status,
      totalAmount: `${Number(order.totalAmount || 0).toFixed(2)} AED`,
    }))
  );
  console.log("Formatted Data:", formattedData);
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Orders
             {/* <span className="text-red-900">{formattedData[0].customerName || ""}</span> */}
             </h2>
          <button onClick={onClose} className="text-red-500 font-bold">X</button>
        </div>

        {/* Reusable Table */}
        <PurchaseTable
          columns={columns}
          data={formattedData}
          searchPlaceholder="Search orders..."
          loading={false}
          searchableFields={["orderNumber", "itemName", "status"]}
          showAction={false} // No actions needed in the modal
        />

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-red-900 text-white px-4 py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
