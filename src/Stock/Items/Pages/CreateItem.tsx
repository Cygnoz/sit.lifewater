import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
// Import reusable table
import plus from "../../../assets/circle-plus.svg";
import PurchaseTable from "../../../commoncomponents/Table/Table";

const CreateItem: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { request: getItems } = useApi("get", 4001);
  const { request: deleteItem } = useApi("delete", 4001);

  const columns = [
    { id: "itemName", label: "Name", visible: true },
    { id: "sku", label: "SKU", visible: true },
    { id: "costPrice", label: "Cost Price", visible: true },
    { id: "sellingPrice", label: "Selling Price", visible: true },
  ];

  const fetchItems = async () => {
    try {
      const url = `${endpoints.GET_ALL_ITEMS}`;
      const { response, error } = await getItems(url);
      if (!error && response) {
        setItems(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/edititem/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const url = `${endpoints.DELETE_AN_ITEM}/${id}`;
      const { response, error } = await deleteItem(url);
      if (!error && response) {
        toast.success(response.data.message);
        fetchItems(); // Refresh the list
      }
    } catch (error) {
      toast.error("Error occurred while deleting the item.");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="p-2 w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[#303F58] text-[20px] font-bold">Item</h3>
            <p className="text-[#4B5C79]">Manage your inventory items</p>
          </div>
          <div>
            <Link to="/additem">
              <button className="flex items-center gap-2 bg-[#820000] text-white px-3 py-2 rounded-md">
                <img src={plus} alt="Add New Item" />
                Add New Item
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <PurchaseTable
            columns={columns}
            data={items}
            loading={loading}
            searchPlaceholder="Search items..."
            searchableFields={["itemName", "sku"]}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
