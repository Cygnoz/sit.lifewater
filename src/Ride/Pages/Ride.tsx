import React, { useContext, useEffect, useState } from "react";
import printer from "../../assets/images/printer.svg";
import split from "../../assets/images/list-filter.svg";
import search from "../../assets/images/search.svg";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4); // Set to 4 rides per page

  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getALLRIDE } = useApi("get", 4000);
console.log(loading,setItemsPerPage);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const currentData = filteredRides.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex gap-3 items-center w-full max-w-8xl  ms-3">
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
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Date</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Sales Man</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Driver</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Vehicle</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Route</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Travelled KM</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Stock</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ride, index) => (
              <tr className="border-b-2" key={ride._id}>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.createdAt
                    ? new Date(ride.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.salesmanName || "N/A"}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.driverName || "N/A"}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.vehicleNumber || "N/A"}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.mainRouteName || "N/A"}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.travelledKM || 0}
                </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {ride.stock && ride.stock.length > 0 ? (
                    <table className="w-full bg-[#fdf8f0]  rounded-lg text-left border-spacing-10">
                      <thead>
                        <tr className="border-1 ">
                          <th className="p-2 text-[12px] text-center text-[#303F58]">
                            Item Name
                          </th>
                          <th className="p-2 text-[12px] text-center text-[#303F58]">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ride.stock.map((item) => (
                          <tr key={item.itemName} className="border-b">
                            <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                              {item.itemName || "N/A"}
                            </td>
                            <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                              {item.quantity || 0} pcs
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    "No Stock"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="border px-4 py-2 rounded-md"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="border px-4 py-2 rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ride;
