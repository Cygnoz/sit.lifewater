import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import plus from "../../assets/circle-plus.svg";
import PurchaseTable from "../../commoncomponents/Table/Table";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

const Suppliers: React.FC = () => {
  const navigate = useNavigate();
  const columns = [
    { id: "companyName", label: "Company Name", visible: true },
    { id: "vendorEmail", label: "Email", visible: true },
    { id: "mobileNumber", label: "Phone Number", visible: true },
    { id: "placeOfSupply", label: "Place Of Supply", visible: true },
  ];

  const [supplier, setSupplier] = useState<any[]>([]);
  const { request: getSupplier } = useApi("get", 4001);
  const { request: deleteSupplier } = useApi("delete", 4001);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const url = `${endpoints.GET_ALL_SUPPLIERS}`;
      const { response, error } = await getSupplier(url);

      if (!error && response) {
        setSupplier(response.data?.data);
      } else {
        console.error("Failed to fetch suppliers:", error);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    navigate(`/editsupplier/${id}`);
  };

  // Handle delete supplier
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const url = `${endpoints.DELETE_SUPPLIER}/${id}`;
        const { response, error } = await deleteSupplier(url);

        if (!error && response) {
          setSupplier((prev) => prev.filter((supplier) => supplier._id !== id));
          console.log("Supplier deleted successfully");
        } else {
          console.error("Failed to delete supplier:", error);
        }
      } catch (err) {
        console.error("Error deleting supplier:", err);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center p-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Suppliers</h3>
          <p className="text-[#4B5C79]">Manage your supplier list efficiently</p>
        </div>
        <div>
          <Link to={"/addvendors"}>
            <button className="flex items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
              <img src={plus} alt="Add" />
              <p>New Supplier</p>
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
        {/* Reusable Table */}
        <PurchaseTable
          columns={columns}
          data={supplier}
          searchPlaceholder="Search Suppliers"
          loading={false}
          searchableFields={["companyName", "vendorEmail", "mobileNumber", "placeOfSupply"]}
          onDeleteClick={handleDelete}
          onEditClick={handleEdit} // Pass handleEdit function
        />
      </div>
    </div>
  );
};

export default Suppliers;
