import React, { useState, useEffect } from "react"
import printer from "../../../assets/images/printer.svg"
import vector from "../../../assets/images/Vector.svg"
import trash from "../../../assets/images/trash.svg"
import split from "../../../assets/images/list-filter.svg"
import plus from "../../../assets/circle-plus.svg"
import search from "../../../assets/images/search.svg"
import { Link, useNavigate } from "react-router-dom"
import { deleteItemAPI } from "../../../services/StockAPI/StockAPI"
import useApi from "../../../Hook/UseApi"
import { endpoints } from "../../../services/ApiEndpoint"
import SortBy from "../Components/SortByItems"

const CreateItem: React.FC = () => {
  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"
  const navigate = useNavigate()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("") // Add search query state
  const [sortedItems, setSortedItems] = useState<any[]>([]); // Store sorted items
  const { request: getItems } = useApi("get", 4001)

  const getAllItems = async () => {
    try {
      const url = `${endpoints.GET_ALL_ITEMS}`
      const { response, error } = await getItems(url)
      console.log(response)

      if (!error && response) {
        setLoading(false)
        setItems(response.data)
        setSortedItems(response.data); // Initialize sorted items
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllItems()
  }, [])

  const handleEdit = (id: string) => {
    navigate(`/edititem/${id}`)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await deleteItemAPI(id);
      alert(response.message);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setSortedItems((prevItems) => prevItems.filter((item) => item._id !== id)); // Update sorted items
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSortChange = (key: string, order: string) => {
    const sorted = [...items].sort((a, b) => {
      if (order === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setSortedItems(sorted);
  };

  const filteredItems = sortedItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full">
      <div className="p-2 w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[#303F58] text-[20px] font-bold">Item</h3>
            <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
          </div>
          <div className="flex items-center">
            <Link to={"/additem"}>
              <button className="flex items-center gap-2 bg-[#820000] text-white px-3 py-2 rounded-md">
                <img src={plus} alt="Add New Item" />
                <p>Add New Item</p>
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-[1100px]">
              <img src={search} alt="Search" className="absolute left-3 top-3 w-4 h-4" />
              <input
                className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.04)",
                  outline: "none",
                  boxShadow: "none",
                }}
                placeholder="Search item"
                value={searchQuery} // Bind to state
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
            <div className="flex space-x-4">
            <SortBy  onSortChange={handleSortChange} />
              <button className="flex items-center border text-sm text-[#565148] font-medium  border-[#565148] px-4 py-2 rounded-lg">
                <img className="mr-1" src={printer} alt="Print" />
                Print
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fdf8f0]">
                <tr className="border-b">
                  <th className="px-4 py-3 text-center font-medium text-[#303F58]">Photo</th>
                  <th className="px-4 py-3 text-center font-medium text-[#303F58]">Name</th>
                  <th className="px-4 py-3 text-center font-medium text-[#303F58]">SKU</th>
                  <th className="px-4 py-3 text-center font-medium text-[#303F58]">Cost Price</th>
                  <th className="px-4 py-3 text-center font-medium text-[#303F58]">Selling Price</th>
                  <th className="px-4 py-3 text-center font-medium text-[#303F58]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="px-4 py-3 text-center">
                        <img className="mx-auto object-cover w-11 h-11 rounded-full" src={item.itemImage || defaultImage} alt={`${item.itemName}`} />
                      </td>
                      <td className="px-4 py-3 text-center text-[#4B5C79]">{item.itemName}</td>
                      <td className="px-4 py-3 text-center text-[#4B5C79]">{item.sku}</td>
                      <td className="px-4 py-3 text-center text-[#4B5C79]">{item.costPrice}</td>
                      <td className="px-4 py-3 text-center text-[#4B5C79]">{item.sellingPrice}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-green-500 mr-2" onClick={() => handleEdit(item._id)}>
                          <img src={vector} alt="Edit" />
                        </button>
                        <button className="text-red-500" onClick={() => handleDelete(item._id)}>
                          <img src={trash} alt="Delete" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateItem
