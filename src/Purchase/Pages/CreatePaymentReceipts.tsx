import React from 'react';
import printer from "../../assets/images/printer.svg";
// import vector from "../../../assets/images/Vector.svg";
// import trash from "../../../assets/images/trash.svg";
import split from "../../assets/images/list-filter.svg";
import plus from "../../assets/circle-plus.svg";
import search from "../../assets/images/search.svg";
import { Link,} from 'react-router-dom';

const CreatePaymentReceipts: React.FC = () => {
    // const navigate = useNavigate();

    // const handleEdit = () => {
    //     navigate('/edititem');
    // };

    return (
        <div className="flex min-h-screen w-full">
            <div className="p-2 w-full">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-[#303F58] text-[20px] font-bold">Payment Receipts</h3>
                        <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
                    </div>
                    <div className="flex items-center">
                        <Link to={'/addpaymentreciept'}>
                            <button className="flex items-center gap-2 bg-[#820000] text-white px-3 py-2 rounded-md">
                                <img src={plus} alt="Add New Item" />
                                <p>Add New</p>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-full max-w-[1100px]">
                            <img src={search} alt="Search" className="absolute left-3 top-3 w-4 h-4" />
                            <input
                                className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
                                style={{
                                    backgroundColor: "rgba(28, 28, 28, 0.04)",
                                    outline: "none",
                                    boxShadow: "none",
                                }}
                                placeholder="Search item"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button className="flex items-center border text-sm text-[#565148] font-medium border-[#565148] px-4 py-2 rounded-lg">
                                <img className="mr-1" src={split} alt="Sort" />
                                Sort By
                            </button>
                            <button className="flex items-center border text-sm text-[#565148] font-medium  border-[#565148] px-4 py-2 rounded-lg">
                                <img className="mr-1" src={printer} alt="Print" />
                                Print
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
    <table className="w-full text-center"> {/* Changed to text-center for the table */}
        <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
                {/* Checkbox Column */}
                <th className="px-4 py-3">
                    <input type="checkbox" />
                </th>
                {/* Table Headers */}
                <th className="px-4 py-3 font-medium text-[#303F58]">Date</th>
                <th className="px-4 py-3 font-medium text-[#303F58]">Payment Number</th>
                <th className="px-4 py-3 font-medium text-[#303F58]">Vendor</th>
                <th className="px-4 py-3 font-medium text-[#303F58]">Reference Number</th>
                <th className="px-4 py-3 font-medium text-[#303F58]">Amount Paid</th>
            </tr>
        </thead>
        <tbody>
            {/* Example Row */}
            <tr className="border-b">
                <td className="px-4 py-3">
                    <input type="checkbox" />
                </td>
                <td className="px-4 py-3 text-[#4B5C79]">15 May 2023</td>
                <td className="px-4 py-3 text-[#4B5C79]">134267</td>
                <td className="px-4 py-3 text-[#4B5C79]">John Doe</td>
                <td className="px-4 py-3 text-[#4B5C79]">lorem ipsum</td>
                <td className="px-4 py-3 text-[#4B5C79]">60.00</td>
            </tr>
            {/* Repeat for other rows */}
        </tbody>
    </table>
</div>

                </div>
            </div>
        </div>
    );
};

export default CreatePaymentReceipts;

