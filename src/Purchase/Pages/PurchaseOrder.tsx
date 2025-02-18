
import { Link } from "react-router-dom";

import plus from "../../assets/circle-plus.svg";
import PurchaseTable from "../../commoncomponents/Table/Table";


const columns = [
  { id: "date", label: "Date", visible: true },
  { id: "number", label: "Number", visible: true },
  { id: "vendor", label: "Vendor Name", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "amount", label: "Amount", visible: true },
];

const mockData = [
  {
    _id: "1",
    date: "15 May 2023",
    number: "1231",
    vendor: "ABCD",
    status: "Billed",
    amount: "60.00",
  },
  {
    _id: "2",
    date: "16 May 2023",
    number: "12312",
    vendor: "ABCDE",
    status: "Billed",
    amount: "60.00",
  },
];

const PurchaseOrder: React.FC = () => {


  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Purchase Order</h3>
          <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
        </div>
        <Link to={"/addpurchaseorder"}>
          <button className="flex items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
            <img src={plus} alt="Add" />
            <p>New Purchase Order</p>
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
       
        <PurchaseTable
          columns={columns}
          data={mockData}
          searchPlaceholder="Search Purchase Order"
          loading={false}
          searchableFields={["date", "number", "vendor"]}
          showAction={false}
        />
      </div>
    </div>
  );
};

export default PurchaseOrder;
