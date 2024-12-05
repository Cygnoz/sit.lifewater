import React, { useState, FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import back from "../../../assets/images/backbutton.svg"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, toast } from "react-toastify"
import { endpoints } from "../../../services/ApiEndpoint"
import useApi from "../../../Hook/UseApi"

const AddItem: React.FC = () => {
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    itemName: "",
    resaleable: true,
    sku: "",
    sellingPrice: "",
    costPrice: "",
    description: "", 
  })
  const [itemImage, setItemImage] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const file = event.target.files?.[0];    
    if (file) {      
      const reader = new FileReader();       
      reader.onloadend = () => {        
        setItemImage(reader.result as string);
      }; 
      reader.readAsDataURL(file);
    }
  }

  const { request: addItem } = useApi("post", 4001);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Prepare the payload
      const payload = {
        ...formValues,
        itemImage: itemImage
      }
      console.log(payload);
      

      // Call the API to add the item
      const url = `${endpoints.ADD_AN_ITEM}`;
      const { response, error } = await addItem(url, payload)
      
      if (!error && response) {
        toast.success("Item has been added successfully.")
        setFormValues({
          itemName: "",
          resaleable: true,
          sku: "",
          sellingPrice: "",
          costPrice: "",
          description: "", 
        })
        setTimeout(() => {
          navigate("/item")
        }, 3000)
      } else {
        // Handle any API errors
        toast.error(error?.message || "Failed to add item. Please try again.")
      }
    } catch (err) {
      console.error("Error adding item:", err)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="p-6">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4 ms-1">
        <Link to={"/item"}>
          <div className="icon-placeholder">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Add New Item</h2>
      </div>

      <div className="w-full mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-[#303F58] font-medium mb-6">Add item</h3>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-52">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center bg-orange-50 rounded-lg py-4 px-6">
                    {itemImage ? (
                      <img src={itemImage} alt="Uploaded Logo" className="object-cover w-20 h-20 rounded-md" />
                    ) : (
                      <div>+</div>
                    )}
                    <span className="text-gray-700 font-semibold text-base">{itemImage ? "Change Image" : "Add Image"}</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <h2 className="text-gray-800 font-bold mt-2">Upload Company Logo</h2>
                <p className="text-gray-500 text-sm">Support: JPG, PNG</p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#303F58] mb-2">Item Name</label>
                  <input 
                    name="itemName" 
                    value={formValues.itemName} 
                    onChange={handleInputChange} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-gray-500 bg-white" 
                    placeholder="Enter item name"
                  />
                </div>

                <div className="flex items-center mt-3 gap-1 text-textColor">
                  <label className="text-textColor text-sm font-semibold" htmlFor="resaleable">
                    Item Reusable
                  </label>
                  <input
                    type="checkbox"
                    id="resaleable"
                    name="resaleable"
                    checked={formValues.resaleable}
                    onChange={(e) =>
                      setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        resaleable: e.target.checked,
                      }))
                    }
                    className="accent-[#97998E] bg-white h-5 w-4 mx-1 my-1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#303F58] mb-2">SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formValues.sku} 
                    onChange={handleInputChange} 
                    placeholder="Enter SKU" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-gray-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#303F58] mb-2">Selling Price</label>
                  <input 
                    type="text" 
                    name="sellingPrice" 
                    value={formValues.sellingPrice} 
                    onChange={handleInputChange} 
                    placeholder="Enter selling Price" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-gray-500" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#303F58] mb-2">Cost Price</label>
                <input 
                  type="text" 
                  name="costPrice" 
                  value={formValues.costPrice} 
                  onChange={handleInputChange} 
                  placeholder="Enter cost price" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-gray-500" 
                />
              </div>

              <div>
                <label className="block text-sm text-[#303F58] mb-2">Description</label>
                <input 
                  type="text" 
                  name="description" 
                  value={formValues.description} 
                  onChange={handleInputChange} 
                  placeholder="Enter Description" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-gray-500" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Link to="/item">
                <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700">
                  Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 bg-[#820000] text-white rounded-md"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddItem