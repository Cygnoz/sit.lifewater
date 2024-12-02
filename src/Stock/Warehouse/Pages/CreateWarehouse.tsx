import split from '../../../assets/images/list-filter.svg';
import search from "../../../assets/images/search.svg";
import trash from "../../../assets/images/trash.svg";
import { toast, ToastContainer, } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import useApi from '../../../Hook/UseApi';
import { endpoints } from '../../../services/ApiEndpoint';
import { WarehouseResponseContext } from '../../../Context/ContextShare';
import PrintButton from '../../../commoncomponents/Buttons/PrintButton';
import AddNewButton from '../../../commoncomponents/Buttons/AddNewButton';

interface WarehouseItem {
  _id: string;
  warehouseName: string;
  contactNo: string;
  address: string;
}

const CreateWarehouse: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const { request: getWarehouseData } = useApi("get", 4001);

  const { setWarehouseResponse } = useContext(WarehouseResponseContext)!;


  const getAllWarehouse = async () => {
    try {
      const url = `${endpoints.GET_ALL_WAREHOUSE}`;
      const { response, error } = await getWarehouseData(url);
      if (!error && response) {
        setWarehouses(response.data.warehouses);
        console.log(response.data.warehouses,"warehouse");
        setWarehouseResponse(response.data.warehouses)
      } else {
        console.log(error);

      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllWarehouse()
  }, []);

  // Delete function to remove a warehouse by its ID
  const { request: deleteWarehouse } = useApi("delete", 4001);

  const handleDelete = async (_id: string)=>{
    try{
      const url =`${endpoints.DELETE_WAREHOUSE}/${_id}`;
      const { response, error } = await deleteWarehouse(url);
      getAllWarehouse()
      if(!error && response){
        toast.success(response?.data.message);
      }
      console.log(response);
      
    }catch (error) {
      toast.error("Error occurred while deleting brand.");
    }
  }
   

  return (
    <div>
       <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Header Section */}
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Warehouse</h3>
          <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
        </div>
        <div className="flex">
          <Link to={'/addwarehouse'}>        
            <AddNewButton>
            Add New Warehouse
            </AddNewButton>
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
            <button className=" items-center border text-[#565148] hidden border-[#565148] px-4 py-2 rounded-lg">
              <img className="mr-1" src={split} alt="Sort" />
              Sort By
            </button>
           <PrintButton></PrintButton>
          </div>
        </div>

       
        {/* Warehouse Table */}
        <table className="w-full text-left">
          <thead className="bg-[#fdf8f0]">
            <tr className="border-b">
             
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
