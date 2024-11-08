import React, { useEffect, useState } from 'react';
import printer from '../../../assets/images/printer.svg';
import split from '../../../assets/images/list-filter.svg';
import search from '../../../assets/images/search.svg';
import plus from '../../../assets/circle-plus.svg';
import { Link } from 'react-router-dom';
import { getAllUnloadsAPI } from '../../../services/StockAPI/UnloadAPI';

const UnloadedAdd: React.FC = () => {
  const [unloads, setUnloads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchUnloads = async () => {
      try {
        const unloadsData = await getAllUnloadsAPI();
        setUnloads(unloadsData);
      } catch (error) {
        setError('Failed to fetch unloads. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnloads();
  }, []);

  // Filter unloads based on search term
  const filteredUnloads = unloads.filter((unload) =>
    Object.values(unload)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnloads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUnloads.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center my-2">
        <div>
          <h1 className="text-xl ml-2 font-bold">Unload</h1>
          <p className='text-gray-500 ms-2 my-2'>Lorem ipsum dolor sit amet</p>
        </div>
        <div className="flex justify-between">
          <Link to={'/addunloadstock'}>
            <button className="flex justify-between items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
              <img src={plus} alt="" />
              <p>Add New</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-2">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Stock"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm w-full rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.04)",
                outline: "none",
                boxShadow: "none",
              }}
            />
            <img src={search} alt="search" className="h-5 w-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
          </div>
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
          <thead className='bg-[#fdf8f0]'>
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58] w-16"><input type="checkbox" /></th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Date</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Transfer No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Main Route</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Warehouses</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((unload, index) => (
              <tr key={unload._id} className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"><input type="checkbox" /></td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">{indexOfFirstItem + index + 1}</td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">{new Date(unload.date).toLocaleDateString()}</td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">{unload.transferNumber}</td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">{unload.mainRoute}</td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">{unload.warehouseName}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnloadedAdd;
