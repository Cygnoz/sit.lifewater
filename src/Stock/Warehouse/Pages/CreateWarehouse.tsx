import printer from '../../../assets/images/printer.svg';
import split from '../../../assets/images/list-filter.svg';
import search from "../../../assets/images/search.svg";
import plus from "../../../assets/circle-plus.svg";
import trash from "../../../assets/images/trash.svg";
import { toast,} from 'react-toastify';

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteWarehouseIdAPI, getWarehouseAPI} from '../../../services/WarehouseAPI/WarehouseAPI'; // Import delete API

interface WarehouseItem {
  _id: string;
  warehouseName: string;
  contactNo: string;
  address: string;
}

const CreateWarehouse: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await getWarehouseAPI();
        setWarehouses(response.warehouses);
        console.log('Warehouses set:', response); // Verify the data
      } catch (error: any) {
        setError(error.message || 'Failed to fetch warehouses');
        console.error('Failed to fetch warehouses:', error);
      }
    };
    fetchWarehouse();
  }, []);

  // Delete function to remove a warehouse by its ID
  const handleDelete = async (id: string) => {
    // Confirm deletion with the user
    const isConfirmed = window.confirm("Are you sure you want to delete this warehouse?");
    if (!isConfirmed) return;
  
    try {
      await deleteWarehouseIdAPI(id); // Call the delete API function
      setWarehouses((prevWarehouses) =>
        prevWarehouses.filter((warehouse) => warehouse._id !== id)
      ); // Remove deleted warehouse from state
  
      // Display success toast
      toast.success(`Warehouse deleted successfully.`);
      console.log(`Warehouse with ID ${id} deleted successfully.`);
    } catch (error: any) {
      setError(error.message || 'Failed to delete warehouse');
      toast.error('Failed to delete warehouse.');
      console.error('Failed to delete warehouse:', error);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Warehouse</h3>
          <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
        </div>
        <div className="flex">
          <Link to={'/addwarehouse'}>
            <button className="flex items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
              <img src={plus} alt="Add New" />
              <p>Add New Warehouse</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full">
            <img src={search} alt="search" className="absolute left-3 top-3 h-5 w-5" />
            <input
              className="pl-9 w-full h-10 rounded-md text-sm text-gray-800 border-0 focus:ring-1 focus:ring-gray-400"
              placeholder="Search"
              style={{ backgroundColor: "rgba(28, 28, 28, 0.04)" }}
            />
          </div>
          <div className="flex w-[60%] justify-end space-x-2">
            <button className="flex items-center border text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
              <img className="mr-1" src={split} alt="Sort" />
              Sort By
            </button>
            <button className="flex items-center border text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
              <img className="mr-1" src={printer} alt="Print" />
              Print
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {/* Warehouse Table */}
        <table className="w-full text-left">
          <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58] w-16">
                <input type="checkbox" />
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Warehouse Name</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Mobile Number</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Address</th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">Action</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.length > 0 ? (
              warehouses.map((item) => (
                <tr className="border-b" key={item._id}>
                  <td className="p-2 text-center w-16">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2 text-center">{item.warehouseName}</td>
                  <td className="p-2 text-center">{item.contactNo}</td>
                  <td className="p-2 text-center">{item.address}</td>
                  <td className="p-2 text-center">
  <button className="text-red-500" onClick={() => handleDelete(item._id)}>
    <img src={trash} alt="Delete" />
  </button>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center text-[#4B5C79]">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateWarehouse;
