// import necessary modules and components
import React, { useState, ChangeEvent, FormEvent } from 'react';
import back from '../../../assets/images/backbutton.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { addWarehouseAPI } from '../../../services/WarehouseAPI/WarehouseAPI';

const AddWarehouse: React.FC = () => {
  // State to manage form values
  const [formData, setFormData] = useState({
    warehouseName: '',
    contactNo: '', // Updated key name to be consistent
    address: ''
  });

const navigate=useNavigate()
const [success, setSuccess] = useState<string | null>(null);
console.log(success);

  // Handler to update form state
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value // Use 'name' to dynamically update the appropriate field
    });
  };

  // Handler for form submission with validation checks
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    // Validate Warehouse Name
    if (!formData.warehouseName.trim()) {
      toast.error('Warehouse Name is required.');
      return;
    }
  
    // Validate Mobile Number (check for digits only, no limit on length)
    if (!/^\d+$/.test(formData.contactNo)) {
      toast.error('Mobile Number must contain only digits.');
      return;
    }
  
    // Validate Address
    if (!formData.address.trim()) {
      toast.error('Address is required.');
      return;
    }
  
    // Create a JSON object instead of FormData (if needed)
    const formDataToSend = {
      warehouseName: formData.warehouseName,
      contactNo: formData.contactNo, // Updated to match state key
      address: formData.address,
    };
  
    // Call the API and handle the response
    const response = await addWarehouseAPI(formDataToSend);
if (response && response.message) {
  toast.success('Warehouse added successfully!');
  setTimeout(() => {
    setSuccess(null);
    navigate("/warehouse");
  }, 3000);

  // Optionally reset form or navigate
  setFormData({ warehouseName: '', contactNo: '', address: '' });
  console.log(formDataToSend);
  console.log(response);
} else {
  toast.error('Failed to add warehouse.');
}

  };
  

  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
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
      {/* First Row: Heading and Icon */}
      <div className="flex gap-4 items-center w-full max-w-8xl mb-6">
        <Link to={'/warehouse'}>
          <div className="icon-placeholder">
            <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[#303F58] text-[20px] font-bold">Create New Warehouse</h2>
      </div>

      {/* Second Row: Form Container */}
      <div className="w-full max-w-8xl bg-white rounded-md shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Warehouse Name
              </label>
              <input
                type="text"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleInputChange}
                placeholder="Enter Warehouse Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">
                Mobile Number
              </label>
              <input
                type="text"
                name="contactNo" // Updated to match state key
                value={formData.contactNo}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              placeholder="Enter Address"
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-3">
            <button
              type="button"
              className="px-2 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              // Optional: add reset or navigation behavior here
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-2 bg-red-800 text-white rounded-md hover:bg-red-800 transition"
            >
              Save
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouse;
