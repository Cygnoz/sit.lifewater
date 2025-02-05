import React from "react";
import { Link } from "react-router-dom";
import plus from "../../assets/circle-plus.svg";
import PurchaseTable from "../../commoncomponents/Table/Table";


const Coupon: React.FC = () => {
  const columns = [
    { id: "slNo", label: "Sl.NO", visible: true },
    { id: "couponName", label: "Coupon Name", visible: true },
    { id: "bottle", label: "Bottle", visible: true },
    { id: "amount", label: "Amount", visible: true },
    { id: "description", label: "Description", visible: true },
  ];

  const data = [
    {
      _id: "1",
      slNo: "122024",
      couponName: "PAY001",
      bottle: "33",
      amount: "AED111",
      description: "wwwwww",
    },
    {
      _id: "2",
      slNo: "132024",
      couponName: "PAY434",
      bottle: "98",
      amount: "AED222",
      description: "ppppp",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Coupon</h3>
          <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur commondo enim odio</p>
        </div>
        <div>
          <Link to={"/addcoupon"}>
            <button className="flex items-center gap-2 bg-[#820000] text-white px-4 py-2 rounded-md">
              <img src={plus} alt="Add" />
              <p>Add New</p>
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
        <PurchaseTable
          columns={columns}
          data={data}
          searchPlaceholder="Search Coupon"
          loading={false}
          searchableFields={["couponName", "amount", "description"]}
          showAction={true}
          onViewClick={(id) => console.log("View", id)}
          onEditClick={(id) => console.log("Edit", id)}
          onDeleteClick={(id) => console.log("Delete", id)}
        />
      </div>
    </div>
  );
};

export default Coupon;
