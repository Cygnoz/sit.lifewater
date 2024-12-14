import { toast, ToastContainer, } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import useApi from '../../../Hook/UseApi';
import { endpoints } from '../../../services/ApiEndpoint';
import { WarehouseResponseContext } from '../../../Context/ContextShare';
import AddNewButton from '../../../commoncomponents/Buttons/AddNewButton';
import Table from '../../../commoncomponents/Table/Table';
import { TableResponseContext } from '../../../assets/Context/ContextShare';

interface WarehouseItem {
  _id: string;
  warehouseName: string;
  contactNo: string;
  address: string;
}

const CreateWarehouse: React.FC = () => {
  const { loading, setLoading } = useContext(TableResponseContext)!

  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [columns] = useState([
    { id: "warehouseName", label: "Warehouse Name", visible: true },
    { id: "contactNo", label: "Mobile Number", visible: true },
    { id: "address", label: "Address", visible: true },
  ])
  const { request: getWarehouseData } = useApi("get", 4001);

  const { setWarehouseResponse } = useContext(WarehouseResponseContext)!;


  const getAllWarehouse = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false })
      const url = `${endpoints.GET_ALL_WAREHOUSE}`;
      const { response, error } = await getWarehouseData(url);
      if (!error && response) {
        setWarehouses(response.data.warehouses);
        console.log(response.data.warehouses, "warehouse");
        setLoading({ ...loading, skeleton: false })
        setWarehouseResponse(response.data.warehouses)
      } else {
        console.log(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true })
      }
    } catch (error) {
      console.log(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true })

    }
  }
  useEffect(() => {
    getAllWarehouse()
  }, []);

  // Delete function to remove a warehouse by its ID
  const { request: deleteWarehouse } = useApi("delete", 4001);

  const handleDelete = async (_id: string) => {
    try {
      const url = `${endpoints.DELETE_WAREHOUSE}/${_id}`;
      const { response, error } = await deleteWarehouse(url);
      getAllWarehouse()
      if (!error && response) {
        toast.success(response?.data.message);
      }
      console.log(response);

    } catch (error) {
      toast.error("Error occurred while deleting warehouse.");
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
      <div className="bg-white shadow-md rounded-lg p-4">

        <Table columns={columns}
          data={warehouses}
          searchPlaceholder="Search Warehose"
          loading={loading.skeleton}
          searchableFields={["warehouseName", "contactNo", "address"]}
          onDeleteClick={handleDelete}
        />

      </div>
    </div>
  );
};

export default CreateWarehouse;
