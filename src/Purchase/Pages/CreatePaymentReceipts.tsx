import React from "react";
import { Link } from "react-router-dom";

import plus from "../../assets/circle-plus.svg";
import PurchaseTable from "../../commoncomponents/Table/Table";

const CreatePaymentReceipts: React.FC = () => {
    const columns = [
        { id: "date", label: "Date", visible: true },
        { id: "paymentNumber", label: "Payment Number", visible: true },
        { id: "vendor", label: "Vendor", visible: true },
        { id: "referenceNumber", label: "Reference Number", visible: true },
        { id: "amountPaid", label: "Amount Paid", visible: true },
    ];

    const data = [
        {
            _id: "1",
            date: "15 May 2023",
            paymentNumber: "134267",
            vendor: "John Doe",
            referenceNumber: "lorem ipsum",
            amountPaid: "60.00",
        },
    ];

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
                    <PurchaseTable 
                        columns={columns} 
                        data={data} 
                        searchPlaceholder="Search item"
                        loading={false}
                        searchableFields={["date", "paymentNumber", "vendor"]}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreatePaymentReceipts;
