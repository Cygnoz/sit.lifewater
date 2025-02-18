import React from "react";
import { Link } from "react-router-dom";

import plus from "../../assets/circle-plus.svg";
import PurchaseTable from "../../commoncomponents/Table/Table";

const columns = [
  { id: "date", label: "Date", visible: true },
  { id: "billNumber", label: "Bill Number", visible: true },
  { id: "supplier", label: "Supplier Name", visible: true },
  { id: "dueDate", label: "Due Date", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "amount", label: "Amount", visible: true },
  { id: "remaining", label: "Remaining", visible: true },
  { id: "description", label: "Description", visible: true },
];

const data = [
  {
    _id: "1",
    date: "15 May 2023",
    billNumber: "152023",
    supplier: "Sajeev",
    dueDate: "16 May 2024",
    status: "Unpaid",
    amount: "60.00",
    remaining: "20.00",
    description: "Lorem ipsum",
  },
  
];

const Purchase: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Purchase</h3>
          <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
        </div>
        <div className="flex justify-between">
          <Link to={"/addpurchase"}>
            <button className="flex justify-between items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
              <img src={plus} alt="" />
              <p>Add New</p>
            </button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
        <PurchaseTable
          columns={columns}
          data={data}
          searchPlaceholder="Search Purchase"
          loading={false}
          searchableFields={["date", "billNumber", "supplier", "status"]}
          showAction={false}
        />
      </div>
    </div>
  );
};

export default Purchase;