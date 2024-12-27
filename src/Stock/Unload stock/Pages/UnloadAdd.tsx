import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";
import PurchaseTable from "../../../commoncomponents/Table/Table";
 // Adjust the path as needed

const UnloadedAdd: React.FC = () => {
  const [unloads, setUnloads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { request: getAllUnloadStockss } = useApi("get", 4001);
console.log(setSearchTerm);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const getALLUnloads = async () => {
    try {
      const url = `${endpoints.GET_ALL_UNLOADS}`;
      const { response, error } = await getAllUnloadStockss(url);
      if (!error && response) {
        setUnloads(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLUnloads();
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

  // Table columns
  const columns = [
  
    { id: "date", label: "Date", visible: true },
    { id: "transferNumber", label: "Transfer No", visible: true },
    { id: "subRouteName", label: "Sub Route", visible: true },
    { id: "warehouseName", label: "Warehouses", visible: true },
  ];

  // Map data for the table
  const tableData = currentItems.map((unload, index) => ({
    ...unload,
    slNo: indexOfFirstItem + index + 1, // Add serial number
  }));

  return (
    <div>
      <div className="flex justify-between items-center my-2">
        <div>
          <h1 className="text-xl ml-2 font-bold">Unload</h1>
          <p className="text-gray-500 ms-2 my-2">Lorem ipsum dolor sit amet</p>
        </div>
        <div className="flex justify-between">
          <Link to={"/addunloadstock"}>
            <button className="flex justify-between items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
              <p>Add New</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Reusable Table */}
      <PurchaseTable
        columns={columns}
        data={tableData}
        renderColumnContent={(colId, item) => {
          if (colId === "date") {
            return new Date(item.date).toLocaleDateString();
          }
          return item[colId];
        }}
        searchPlaceholder="Search Stock"
        loading={false} // Set true if data is still loading
        searchableFields={["transferNumber", "subRouteName", "warehouseName"]}
        showAction={false} // Hide actions for now
      />

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
            className={`px-3 py-1 mx-1 rounded-md ${
              currentPage === i + 1 ? "bg-red-800 text-white" : "bg-gray-200"
            }`}
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
  );
};

export default UnloadedAdd;
