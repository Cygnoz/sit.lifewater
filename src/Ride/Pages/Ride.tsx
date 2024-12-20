import React, { useContext, useEffect, useState } from "react";
import printer from "../../assets/images/printer.svg";
import split from "../../assets/images/list-filter.svg";
import search from "../../assets/images/search.svg";
import eyeIcon from "../../assets/images/eye.svg";
import { endpoints } from "../../services/ApiEndpoint";
import { TableResponseContext } from "../../assets/Context/ContextShare";
import useApi from "../../Hook/UseApi";

interface RideData {
  _id: string;
  createdAt?: string;
  salesmanName: string;
  driverName: string;
  vehicleNumber: string;
  mainRouteName: string;
  stock: { itemName: string; quantity: number }[];
  travelledKM: number;
}

const Ride: React.FC = () => {
  const [rides, setRides] = useState<RideData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStock, setSelectedStock] = useState<
    { itemName: string; quantity: number }[] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getALLRIDE } = useApi("get", 4000);

  const getALLRides = async () => {
    try {
      const url = `${endpoints.GET_ALL_COMPLETED_RIDE}`;
      const { response, error } = await getALLRIDE(url);

      if (!error && response) {
        setLoading(false);
        const mappedData = response.data?.data.map((ride: any) => ({
          _id: ride._id,
          createdAt: ride.createdAt,
          salesmanName: ride.salesmanName,
          driverName: ride.driverName,
          vehicleNumber: ride.vehicleNumber,
          mainRouteName: ride.mainRouteName,
          stock: ride.stock,
          travelledKM: ride.travelledKM,
        }));
        setRides(mappedData);
        console.log("API :", mappedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getALLRides();
  }, []);

  const filteredRides = rides.filter((ride) => {
    const searchText = searchTerm.toLowerCase();
    return (
      ride.salesmanName.toLowerCase().includes(searchText) ||
      ride.driverName.toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const paginatedRides = filteredRides.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleViewStock = (stock: { itemName: string; quantity: number }[]) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };
  console.log(loading);
  

  return (
    <div className="mt-2">
      <div className="flex gap-3 items-center w-full max-w-8xl mb-6 ms-3">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Ride</h3>
          <p className="text-[#4B5C79]">View completed ride details here</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full flex items-center">
            <div className="absolute left-2">
              <img src={search} alt="search" className="h-5 w-5" />
            </div>
            <input
              className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.04)",
                outline: "none",
                boxShadow: "none",
              }}
              placeholder="Search by Salesman or Driver"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex w-[60%] justify-end">
            <button className="flex border text-[14px] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
              <img src={split} className="mt-1 me-1" alt="" />
              Sort By
            </button>
            <button className="flex border text-[14px] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
              <img src={printer} className="mt-1 me-1" alt="" />
              Print
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Sl No
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Date
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Sales Man
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Driver
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Vehicle
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Route
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Travelled KM
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRides.map((ride, index) => (
              <tr className="border-b" key={ride._id}>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {ride.createdAt
                    ? new Date(ride.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {ride.salesmanName}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {ride.driverName}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {ride.vehicleNumber}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {ride.mainRouteName}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  {ride.travelledKM || "0"}
                </td>
                <td className="p-2 text-[14] text-center text-[#4B5C79]">
                  <button
                    onClick={() => handleViewStock(ride.stock)}
                    className=" flex items-center"
                  >
                    <img
                      src={eyeIcon}
                      alt="View Stock"
                      className="h-5 w-5 mr-1"
                    />
                    {ride.stock.length}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && selectedStock && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Stock Details</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fdf8f0]">
                  <th className="border-b p-2 text-[#303F58]">Item Name</th>
                  <th className="border-b p-2 text-[#303F58]">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedStock.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border-b p-2">{item.itemName}</td>
                    <td className="border-b p-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-800 rounded hover:bg-red-900 text-white float-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ride;
