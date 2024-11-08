import shopping from "../../../assets/images/Group 2506.png";
import packing from "../../../assets/images/Group 2507.png";
import processing from "../../../assets//images/Group 2508.png";
import delivery from "../../../assets/images/Group 2509.png";
import plus from "../../../assets/circle-plus.svg";

import printer from "../../../assets/images/printer.svg";
import split from "../../../assets/images/list-filter.svg";
import search from "../../../assets/images/search.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStockloaded } from "../../../services/StockAPI/StockLoadedAPI";

const StockLoaded: React.FC = () => {
  const [stockload, setStockload] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
console.log(loading);
console.log(error);


  
  useEffect(() => {
    const fetchStockloads = async () => {
      try {
        const stockloadData = await getAllStockloaded();
        setStockload(stockloadData);
        console.log(stockloadData);
        
      } catch (error) {
        setError('Failed to fetch unloads. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockloads();
  }, []);

  const filteredStockloads = stockload.filter((stock) =>
    stock.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  
  );

  const totalPages = Math.ceil(filteredStockloads.length / itemsPerPage);
  const paginatedData = filteredStockloads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  
  return (
    <div>
      <div className="flex min-h-screen w-full">
        <div>
          <div className="p-2">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[#303F58] text-[20px] font-bold">
                  Stock Loaded
                </h3>
                <p className="text-[#4B5C79]">
                View detailed information about all stock items loaded across various periods{" "}
                </p>
              </div>
              <div className="flex justify-between">
                <Link to={'/addstockloaded'}>
                <button className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md">
                  <img src={plus} alt="" />
                  <p>Add New Stock</p>
                </button>
                </Link>
                
              </div>
            </div>
            {/* Cards Section */}
            <div className="grid grid-cols-4 gap-4 my-3">
              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={shopping} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  Total Stock Load
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                Total number of stock items loaded this month{" "}
                </p>
                <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                  120
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={packing} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  Today Stock Loaded
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                Number of stock items loaded today{" "}
                </p>

                <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">
                  100
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={processing} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  Week Stock Loaded
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                Total number of stock items loaded this week.{" "}
                </p>
                <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">
                  10
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={delivery} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  This Month
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                Total number of stock items loaded in the current month.{" "}
                </p>
                <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">
                  12
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="absolute ml-3 ">
                  <img src={search} alt="search" className="h-5 w-5" />
                </div>
                <input
                  className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
                  style={{
                    backgroundColor: "rgba(28, 28, 28, 0.04)",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  placeholder="Search Stock"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="flex w-[60%] justify-end">
                  <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                    <img className="mt-1 me-1" src={split} alt="" />
                    Sort By
                  </button>
                  <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
                    <img className="mt-1 me-1" src={printer} alt="" />
                    Print
                  </button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className=" bg-[#fdf8f0]">
                  <tr className="border-b">
                    <th className="p-2 text-[12px] text-center text-[#303F58] w-16">
                      {" "}
                      <input type="checkbox" />
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Sl No
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Date
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Transfer No
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Stock
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Main Route
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((stock,index)=>(
                     <tr className="border-b">
                     <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16">
                       {" "}
                       <input type="checkbox" />
                     </td>
                     <td className="p-2 text-[14] text-center text-[#4B5C79]">
                     {index + 1 + (currentPage - 1) * itemsPerPage}
                     </td>
                     <td className="p-2 text-[14] text-center text-[#4B5C79]">
                     {stock.date.split('T')[0]}
                     </td>
                     <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {stock.transferNumber}
                     </td>
                     <td className="p-2 text-[14] text-center text-[#4B5C79]">
                     {stock.items.map((item:any)=>(
                        item.itemName
                      ))}
                     </td>
                     <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {stock.mainRoute}
                     </td>
                   </tr>

                  )

                  
                  )}
                 
                </tbody>
              </table>
                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockLoaded;
