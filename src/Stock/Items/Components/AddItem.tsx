import React, { useState, FormEvent } from 'react';
import { addItemAPI } from '../../../services/StockAPI/StockAPI';
import upload from "../../../assets/images/upload image.svg";
import { Link, useNavigate } from 'react-router-dom';
import back from '../../../assets/images/backbutton.svg';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from "react-toastify";

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itemName: '',
    SKU: '',
    retailPrice: '',
    purchasePrice: '',
    description: '',
  });
  
  const [profile, setProfile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object to handle file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Append the image if it exists
      if (profile) {
        submitData.append('itemImage', profile);
      }

      await addItemAPI(submitData);
      
      // Show success toast
      toast.success("Item has been added successfully.");

      // Navigate after a short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/item');
      }, 3000);
    } catch (err) {
      // Show error toast
      toast.error("Failed to add item. Please try again.");
      console.error('Error adding item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6'>
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
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4 ms-1">
        <Link to={'/item'}>
          <div className="icon-placeholder">
            <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Add New item</h2>
      </div>

      <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-x-5">
          {/* Item Name */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1 mt-5">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="Enter Item Name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex">
            <label className="mt-4 border text-[#8F99A9] text-base font-[14px] rounded-lg cursor-pointer">
              <div className="w-[80px] h-[80px] bg-[#F7E7CE] rounded-lg overflow-hidden">
                <img
                  src={profile ? URL.createObjectURL(profile) : upload}
                  alt=""
                  className="object-cover w-20 h-20 rounded-md p-5"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileChange}
              />
            </label>
            <h2 className="font-bold mt-10 ms-3 text-[#303F58]">
              Upload Item Image
            </h2>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">SKU</label>
            <input
              type="text"
              name="SKU"
              value={formData.SKU}
              onChange={handleInputChange}
              placeholder="Enter SKU"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Retail Price */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Price</label>
            <input
              type="number"
              name="retailPrice"
              value={formData.retailPrice}
              onChange={handleInputChange}
              placeholder="Enter Retail Price"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleInputChange}
              placeholder="Enter Purchase Price"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Description"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end mt-6">
            <Link to="/item">
              <button
                className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]"
                type="button"
              >
                Cancel
              </button>
            </Link>
            <button
              className="px-3 py-1 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Toast Component */}
    </div>
  );
};

export default AddItem;