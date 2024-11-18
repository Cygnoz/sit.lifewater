import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import back from "../../assets/images/backbutton.svg"
import upload from "../../assets/images/upload image.svg"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getACustomerAPI, updateCustomerAPI } from "../../services/CustomerAPI/Customer"

export default function EditCustomer() {
  const [formData, setFormData] = useState({
      customerType: "Business",
      fullName: "",
      mobileNo: "",
      addressLine1: "",
      addressLine2: "",
      whatsappNumber: "",
      city: "",
      street: "",
      flatNumber: "",
      numberOfBottles: 0,
      ratePerBottle: "",
      depositAmount: "",
      paymentMode: "Cash",
      zipPostalCode: "",
      mainRoute: "",
      subRoute: "",
    })
  const { id } = useParams()
  const [logo, setLogo] = useState<File | null>(null)
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getACustomerAPI(id as string)
        setFormData(response)
      } catch (error) {
        console.error("Error fetching customer:", error)
      }
    }

    if (id) {
      fetchCustomer()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
    }
  }

  const handleWhatsappCheckbox = () => {
    setWhatsappSameAsMobile(!whatsappSameAsMobile)
    setFormData((prev) => ({
      ...prev,
      whatsappNo: !whatsappSameAsMobile ? prev.mobileNo : "",
    }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToUpdate = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToUpdate.append(key, formData[key])
    })

    if (logo) {
      formDataToUpdate.append("logo", logo)
    }

    try {
      const response = await updateCustomerAPI(id as string, formDataToUpdate)
      if (response) {
        toast.success("Customer updated successfully!")
        setTimeout(() => {
          navigate("/customer")
        }, 1000)
      } else {
        toast.error("Failed to update customer")
      }
    } catch (error) {
      toast.error("An error occurred while updating the customer.")
      console.error("Error updating customer:", error)
    }
  }

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} theme="colored" />
      
      <div className="flex gap-3 items-center w-full max-w-8xl mb-1 ms-1 p-3">
        <Link to="/customer">
          <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Edit Customer</h2>
      </div>

      <div className="w-full mx-auto px-10 py-5 bg-white rounded-lg shadow-md">
        
      <form onSubmit={handleUpdate}>
  <div className="flex gap-6">
    <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-52">
      <label className="cursor-pointer">
        <div className="flex flex-col items-center bg-orange-50 rounded-lg py-4 px-6">
          <img src={upload} alt="Upload" />
          <span className="text-gray-700 font-semibold text-base">Add Image</span>
        </div>
        <input type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
      </label>
      <h2 className="text-gray-800 font-bold mt-2">Upload Company Logo</h2>
    </div>

    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="col-span-1">
        <label className="block text-[#303F58] font-medium text-sm mb-1">Full Name</label>
        <input 
          type="text" 
          name="fullName" 
          value={formData.fullName} 
          onChange={handleInputChange} 
          className="w-full h-[36px] px-3 py-1 border rounded-md" 
        />
      </div>

      <div className="col-span-1">
        <label className="block text-[#303F58] font-medium text-sm mb-1">Customer Type</label>
        <select 
          name="customerType" 
          value={formData.customerType} 
          onChange={handleInputChange} 
          className="w-full h-[36px] px-3 py-1 border rounded-md"
        >
          <option value="">Select customer type</option>
          <option value="Business">Business</option>
          <option value="Individual">Individual</option>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
        </select>
      </div>

      <div className="col-span-1">
        <label className="block text-[#303F58] font-medium text-sm mb-1">Mobile Number</label>
        <input 
          type="tel" 
          name="mobileNo" 
          value={formData.mobileNo} 
          onChange={handleInputChange} 
          className="w-full h-[36px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter mobile" 
          maxLength={14} 
        />
      </div>

      <div className="col-span-1">
        <label className="block text-[#303F58] font-medium text-sm mb-1">
          WhatsApp Number
          <input 
            type="checkbox" 
            className="ml-2" 
          />
          <span className="ml-1 text-gray-500 text-xs">Same as Mobile Number</span>
        </label>
        <input 
          type="tel" 
          name="whatsappNumber" 
          value={formData.whatsappNumber} 
          onChange={handleInputChange} 
          className="w-full h-[36px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Enter WhatsApp number" 
          maxLength={14} 
        />
      </div>

      <div className="col-span-2">
        <label className="block text-[#303F58] font-medium text-sm mb-1">Address Line 1</label>
        <input 
          type="text" 
          name="addressLine1" 
          value={formData.addressLine1} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter address" 
        />
      </div>
      <div className="col-span-2">
        <label className="block text-[#303F58] font-medium text-sm mb-1">Address Line 2</label>
        <input 
          type="text" 
          name="addressLine2" 
          value={formData.addressLine2} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter address 2" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
        <input 
          type="text" 
          name="street" 
          value={formData.street} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter street" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input 
          type="text" 
          name="city" 
          value={formData.city} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter city" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Flat Number</label>
        <input 
          type="text" 
          name="flatNumber" 
          value={formData.flatNumber} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter flat number" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Postal Code</label>
        <input 
          type="text" 
          name="zipPostalCode" 
          value={formData.zipPostalCode} 
          onChange={handleInputChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Enter zip code" 
        />
      </div>
    </div>
  </div>

  <div className="flex justify-end">
    <button 
      className="px-3 py-1 mt-8 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]" 
      type="button"
    >
      Cancel
    </button>
    <button 
      className="px-3 py-1 mt-8 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]" 
      type="submit"
    >
      Save
    </button>
  </div>
</form>

  </div>
</div>
  )
}
