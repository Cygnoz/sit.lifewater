
import frame from "../assets/images/Frame 629279.svg";
import damage from "../assets/images/Frame 629278.svg";
import fram from "../assets/images/rupeeframe.svg";
import { useEffect, useState } from "react";

const Stock: React.FC = () => {
  const [stockData, setStockData] = useState<
    { itemName: string; quantity: number }[]
  >([]);

  // Fetch stock data from local storage
  useEffect(() => {
    const storedData = localStorage.getItem("activeRoute");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setStockData(parsedData.stock || []); // Set the stock array
    }
  }, []);

  return (
    <div className="bg-[#F5F6FA]  min-h-screen">
      <div className=" p-3 flex flex-col items-center justify-center ">
        {/* Main Container */}
        <div className="w-full max-w-lg  p-4">
          {/* Top Section: Stock balance, Damage Stock, Internal Order */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Stock balance */}
            <div className="bg-[#FFFFFF] shadow p-3 rounded-lg  flex flex-col ">
              <span className=" rounded-full">
                <img src={frame} alt="Icon" className="w-9 h-9 mb-1" />
              </span>
              <span className="text-3xl  font-bold text-left text-[#820000]">
                {stockData.length}
              </span>

              <span className="text-[11px] font-bold leading-[13.31px] text-[#787A7D] text-left">
                Stock In Hand
              </span>
            </div>
            {/* Damage Stock */}
            <div className="bg-[#FFFFFF] shadow p-3 rounded-lg flex flex-col ">
              <span className="rounded-full">
                <img src={damage} alt="Icon" className="w-9 h-9" />
              </span>
              <span className="text-3xl  font-bold text-left text-[#820000]">
                -
              </span>
              <span className="text-[11px] font-bold leading-[13.31px] text-left text-[#787A7D] ">
                Damage Stock
              </span>
            </div>
            {/* Internal Order */}
            <div className="bg-[#FFFFFF] shadow p-3 rounded-lg flex flex-col ">
              <span className="rounded-full">
                <img src={fram} alt="Icon" className="w-9 h-9" />
              </span>
              <span className="text-3xl  font-bold text-left text-[#820000]">
                -
              </span>
              <span className="text-[11px] font-bold leading-[13.31px] text-left text-[#787A7D] ">
                Internal Order
              </span>
            </div>
          </div>

          {/* Lower Section: Empty Stock, Advance Stock, Started Stock */}
          {/* <div className="space-y-4 bg-[#FFFFFF] rounded shadow p-5">
           
            <div className="bg-[#F5F6FA] p-2  rounded-lg flex items-center">
              <div className=" w-10 h-10 flex justify-center items-center rounded-full mr-4">
                

                <span className="bg-[#E3E6D5] p-2 rounded-full">
                  <img src={rupee} alt="Icon" className="w-6 h-6" />
                </span>
              </div>
              <div className="text-left">
                <span className="text-[18px] font-bold text-left text-[#820000]">
                  0
                </span>
                <span className="block text-[14px] font-bold leading-[16.94px] text-[#787A7D]">
                  Empty Stock
                </span>
              </div>
            </div>

            <div className="bg-[#F5F6FA] p-2 rounded-lg flex items-center">
              <div className="w-10 h-10 flex justify-center items-center rounded-full mr-4">
               
                <span className="bg-[#E3E6D5] p-2 rounded-full">
                  <img src={rupee} alt="Icon" className="w-6 h-6" />
                </span>
              </div>
              <div className="text-left">
                <span className="text-[18px] font-bold text-[#820000]">38</span>
                <span className="block text-[14px] font-bold leading-[16.94px] text-center text-[#787A7D]">
                  Advance Stock
                </span>
              </div>
            </div>

        
            <div className="bg-[#F5F6FA] p-2 rounded-lg flex items-center">
              <div className="bg-gray-300 w-10 h-10 flex justify-center items-center rounded-full mr-4">
               
                <span className="bg-[#E3E6D5] p-2 rounded-full">
                  <img src={rupee} alt="Icon" className="w-6 h-6" />
                </span>
              </div>
              <div className="text-left">
                <span className="text-[18px] text-[#820000] font-bold ">
                  38
                </span>
                <span className="block text-[14px] font-bold leading-[16.94px] text-center text-[#787A7D]">
                  Started Stock
                </span>
              </div>
            </div>
          </div> */}
          <div className="overflow-x-auto mt-5">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#fdf8f0]">
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                    Sl.No
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                    Item Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 ? (
                  stockData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.itemName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="border border-gray-300 px-4 py-2 text-center"
                      colSpan={3}
                    >
                      No Stock available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
