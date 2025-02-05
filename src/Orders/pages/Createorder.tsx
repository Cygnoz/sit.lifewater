import React, { useContext, useEffect, useState } from "react";
import shopping from "../../assets/shopping-bag_6948334 1.svg";
import packing from "../../assets/images/Group.svg";
import delivery from "../../assets/images/delivery-box.svg";
import plus from "../../assets/circle-plus.svg";
import printer from "../../assets/images/printer.svg";
import split from "../../assets/images/list-filter.svg";
import search from "../../assets/images/search.svg";
import { useNavigate } from "react-router-dom";
import Table from "../../commoncomponents/Table/Table";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";
import { TableResponseContext } from "../../assets/Context/ContextShare";

interface OrderDetails {
  _id: string;
  customerName: string;
  salesman: string;
  mainRouteName: string;
  subRouteName: string;
  date: string;
  orderNumber: string;
  paymentMode: string;
  totalAmount: number;
}

const CreateOrder: React.FC = () => {
  const [cashCount, setCashCount] = useState<number>(0);
  const [creditCount, setCreditCount] = useState<number>(0);
  const [totalAmountSum, setTotalAmountSum] = useState<number>(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("All");

  const navigate = useNavigate();
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getALLOrders } = useApi("get", 4001);
  const { request: deleteOrder } = useApi("delete", 4001);

  const [orders, setOrders] = useState<OrderDetails[]>([]);

  const getALLOrderss = async () => {
    try {
      const url = `${endpoints.GET_ALL_ORDERS}`;
      const { response, error } = await getALLOrders(url);

      if (!error && response) {
        const sortedOrders = response.data.sort(
          (a: OrderDetails, b: OrderDetails) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        let cash = 0,
          credit = 0,
          totalAmount = 0;
        sortedOrders.forEach((order: any) => {
          if (order.paymentMode === "Cash") cash++;
          else if (order.paymentMode === "Credit") credit++;

          totalAmount += order.totalAmount;
        });

        setLoading(false);
        setOrders(sortedOrders);
        setCashCount(cash);
        setCreditCount(credit);
        setTotalAmountSum(totalAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLOrderss();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const url = `${endpoints.DELETE_AN_ORDER}/${id}`;
      const { response, error } = await deleteOrder(url);
      getALLOrderss();

      if (!error && response) toast.success(response?.data.message);
      else toast.error("Error occurred while deleting Order.");
    } catch (error) {
      toast.error("Error occurred while deleting Order.");
    }
  };

  // Filtered orders based on selected payment mode
  const filteredOrders = orders.filter(
    (order) =>
      selectedPaymentMode === "All" || order.paymentMode === selectedPaymentMode
  );

  const salesData = [
    {
      img: delivery,
      title: "Revenue",
      lorem: "Total revenue generated",
      value: `${totalAmountSum} AED` || 0,
    },

    {
      img: shopping,
      title: "Cash Sale",
      lorem: "Total cash sales made",
      value: cashCount || 0,
    },
    {
      img: packing,
      title: "Credit Sale",
      lorem: "Total credit sales made",
      value: creditCount || 0,
    },
  ];

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "date") {
      return (
        <div className="flex justify-center">
          {new Date(item.date).toLocaleDateString("en-GB")}
        </div>
      );
    }
    return item[colId as keyof typeof item];
  };

  return (
    <div className="min-h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />

      <div className="p-2">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[#303F58] text-[20px] font-bold">
              Create Order
            </h3>
            <p className="text-[#4B5C79]">You can view all orders here.</p>
          </div>
          <button
            onClick={() => navigate("/addneworder")}
            className="hidden items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md"
          >
            <img src={plus} alt="Add Order" />
            <p>New Order</p>
          </button>
        </div>

        {/* card section  */}
        <div className="grid grid-cols-3 gap-4 my-6 w-full">
          {salesData.map((item, index) => (
            <div
              key={index}
              className={`p-4 bg-white shadow-md rounded-lg cursor-pointer ${
                selectedPaymentMode === item.title.split(" ")[0]
                  ? "border-2 border-[#820000]"
                  : ""
              }`}
              onClick={() => {
                if (item.title !== "Revenue") {
                  // Prevent selecting "Revenue"
                  const mode = item.title.split(" ")[0];
                  setSelectedPaymentMode(mode);
                }
              }}
            >
              <img src={item.img} alt={item.title} />
              <div className="font-bold text-[#303F58] text-[17px] mt-2">
                {item.title}
              </div>
              <p className="text-[#4B5C79] py-1 text-[12px]">{item.lorem}</p>
              <div className="text-[#820000] font-bold text-[18px] mt-2">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="justify-between items-center mb-4 hidden">
            <div className="absolute ml-3 ">
              <img src={search} alt="search" className="h-5 w-5" />
            </div>
            <input
              className="pl-9 text-sm w-[100%] rounded-md text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.04)",
                outline: "none",
                boxShadow: "none",
              }}
              placeholder="Search Order"
            />
            <div className="flex w-[60%] justify-end ">
              <button className="flex border text-[14] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                <img className="mt-1 me-1" src={split} alt="" />
                Sort By
              </button>
              <button className="flex border text-[14] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
                <img className="mt-1 me-1" src={printer} alt="" />
                Print
              </button>
            </div>
          </div>

          <div className="bg-white p-5 mt-5 rounded-lg">
            <Table
              columns={[
                { id: "date", label: "Date", visible: true },
                { id: "customerName", label: "Customer Name", visible: true },
                { id: "mainRouteName", label: "Main Route", visible: true },
                { id: "subRouteName", label: "Subroute Name", visible: true },
                { id: "orderNumber", label: "Order Number", visible: true },
                { id: "salesman", label: "Salesman", visible: true },
              ]}
              data={filteredOrders}
              renderColumnContent={renderColumnContent}
              searchPlaceholder="Search Customer"
              searchableFields={[
                "subRouteName",
                "date",
                "customerName",
                "mainRouteName",
                "orderNumber",
                "salesman",
              ]}
              loading={loading.skeleton}
              onViewClick={(id) => navigate(`/vieworder/${id}`)}
              onDeleteClick={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
