import React, { useState } from "react"
import { Link } from "react-router-dom"
import back from "../../assets/images/backbutton.svg"
import upload from "../../assets/images/upload image.svg"
// import { addBusinessCustomerAPI, addIndividualCustomerAPI } from "../../services/CustomerAPI/Customer"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { addCustomerAPI } from "../../services/CustomerAPI/Customer"

interface CustomerFormData {
  customerType: string
  companyName: string
  firstName: string
  lastName: string
  mobileNo: string
  workPhone: string
  workPhone2: string
  whatsappNo: string
  currency: string
  currencyCode: string
  state: string
  city: string
  billingAddress: string
  salesman: string
  nationality: string
  noOfBottles: string
  ratePerBottle: string
  depositAmount: string
  paymentMode: string
  companyWebsite: string
  taxPreference: string
  placeOfSupply: string
  area: string
  zipPostalCode: string
  email: string
  landmark: string
  buildingNo: string
  street: string
  mainRoute: string
  subRoute: string
}

export default function AddCustomer() {
  const [formData, setFormData] = useState<CustomerFormData>({
    customerType: "Business",
    companyName: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    workPhone: "",
    workPhone2: "",
    whatsappNo: "",
    currency: "",
    currencyCode: "AED",
    state: "",
    city: "",
    billingAddress: "",
    salesman: "",
    nationality: "",
    noOfBottles: "",
    ratePerBottle: "",
    depositAmount: "",
    paymentMode: "Cash",
    companyWebsite: "",
    taxPreference: "",
    placeOfSupply: "",
    area: "",
    zipPostalCode: "",
    email: "",
    landmark: "",
    buildingNo: "",
    street: "",
    mainRoute: "",
    subRoute: "",
  })

  const [logo, setLogo] = useState<File | null>(null)
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleWhatsappCheckbox = () => {
    setWhatsappSameAsMobile(!whatsappSameAsMobile)
    setFormData((prev) => ({
      ...prev,
      whatsappNo: !whatsappSameAsMobile ? prev.workPhone : "",
    }))
  }
  

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
    }
  }

  const clearForm = () => {
    setFormData({
      customerType: "Business",
      companyName: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      workPhone: "",
      workPhone2: "",
      whatsappNo: "",
      currency: "",
      currencyCode: "INR",
      state: "",
      city: "",
      billingAddress: "",
      salesman: "",
      nationality: "",
      noOfBottles: "",
      ratePerBottle: "",
      depositAmount: "",
      paymentMode: "Cash",
      companyWebsite: "",
      taxPreference: "",
      placeOfSupply: "",
      area: "",
      zipPostalCode: "",
      email: "",
      landmark: "",
      buildingNo: "",
      street: "",
      mainRoute: "",
      subRoute: "",
    })
    setLogo(null)
    setWhatsappSameAsMobile(false)
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const formDataObj = new FormData();

  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (key === 'customerType') {
  //       formDataObj.append(key, value.toString());
  //     } else if (value !== null && value !== undefined && value !== "") {
  //       formDataObj.append(key, value.toString());
  //     }
  //   });

  //   if (logo) {
  //     formDataObj.append("logo", logo);
  //   }

  //   try {
  //     const response = await addCustomerAPI(formDataObj);

  //   console.log("Response status:", response.status);

  //     // Check for response status
  //     if (response.status === 201) {
  //       toast.success(response.message); // Display success message
  //       clearForm();
  //     } else {
  //       toast.error(response.message || "Failed to add customer. Please try again.");
  //     }
  //   } catch (error: any) {
  //     console.error("Error submitting the form:", error);
  //     toast.error(error.message || "Failed to add customer. Please try again.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formDataObj = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "customerType") {
        formDataObj.append(key, value.toString())
      } else if (value !== null && value !== undefined && value !== "") {
        formDataObj.append(key, value.toString())
      }
    })

    if (logo) {
      formDataObj.append("logo", logo)
    }

    try {
      const response = await addCustomerAPI(formDataObj)

      console.log("Response:", response) // Debug log

      if (response.status === 201) {
        toast.success(response.message || "Customer added successfully")
        clearForm()
      } else {
        toast.error(response.message || "Failed to add customer. Please try again.")
      }
    } catch (error: any) {
      console.error("Error submitting the form:", error)
      toast.error(error.message || "Failed to add customer. Please try again.")
    }
  }

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="flex gap-3 items-center w-full max-w-8xl mb-1 ms-1 p-3">
        <Link to="/customer">
          <div className="icon-placeholder">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Create New Customer</h2>
      </div>

      <div className="w-full mx-auto px-10 py-5 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {/* Customer type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-3">Customer Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="customerType" value="Business" checked={formData.customerType === "Business"} onChange={handleInputChange} className="mr-2" required />
                    Business
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="customerType" value="Individual" checked={formData.customerType === "Individual"} onChange={handleInputChange} className="mr-2" required />
                    Individual
                  </label>
                </div>
              </div>

              {/* Conditional rendering for company name (if Business is selected) */}
              {formData.customerType === "Business" && (
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Company Name" required />
                </div>
              )}

              {/* Primary contact */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Primary Contact</label>
                <div className="grid grid-cols-2 space-x-2">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="First Name" required />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="h-[36px] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last Name" required />
                </div>
              </div>

              {/* Mobile number, work phone */}
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Mobile Number</label>
                  <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter mobile" maxLength={10} pattern="\d{10}" required />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Work Phone</label>
                  <input type="text" name="workPhone" value={formData.workPhone} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter work phone" maxLength={10} pattern="\d{10}" />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Currency</label>
                <div className="flex">
                  <input type="text" name="currency" value={formData.currency} onChange={handleInputChange} className="w-[600px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Price" />
                  <input type="text" name="currencyCode" value={formData.currencyCode} onChange={handleInputChange} className="w-[50px] h-[36px] px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="AED" />
                </div>
              </div>

              {/* State, City */}
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter state" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter city" />
                </div>
              </div>

              {/* Building Address */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Billing Address</label>
                <textarea name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md"></textarea>
              </div>

              {/* Sales Man, Nationality */}
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Sales Man</label>
                  <input type="text" name="salesman" value={formData.salesman} onChange={handleInputChange} className="h-[36px] w-full px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter sales man" required />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Nationality</label>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="h-[36px] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter nationality" />
                </div>
              </div>

              {/* Number of bottles, Rate per bottle, Deposit amount */}
              <div className="flex space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Number of bottles</label>
                  <input type="text" name="noOfBottles" value={formData.noOfBottles} onChange={handleInputChange} className="h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter number of bottles" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Rate per bottle</label>
                  <input type="text" name="ratePerBottle" value={formData.ratePerBottle} onChange={handleInputChange} className="px-3 h-[36px] py-2 border rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter rate per bottle" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Deposit Amount</label>
                  <input type="text" name="depositAmount" value={formData.depositAmount} onChange={handleInputChange} className="px-3 h-[36px] py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter deposit amount" />
                </div>
              </div>

              {/* Payment mode */}
              <div className="mt-3">
                <label className="block text-[#303F58] font-[14px] my-2">Payment Mode</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="paymentMode" value="Cash" checked={formData.paymentMode === "Cash"} onChange={handleInputChange} className="mr-2" required />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="paymentMode" value="Credit" checked={formData.paymentMode === "Credit"} onChange={handleInputChange} className="mr-2" required />
                    Credit
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="paymentMode" value="Coupon" checked={formData.paymentMode === "Coupon"} onChange={handleInputChange} className="mr-2" required />
                    Coupon
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {formData.customerType === "Business" && (
                <div>
                  {/* Uploaded Image */}
                  <div className="flex">
                    <label className="mt-4 border text-[#8F99A9] text-base font-[14px] rounded-lg cursor-pointer">
                      <div className="w-[80px] h-[80px] bg-[#F7E7CE] rounded-lg overflow-hidden">
                        <img src={logo ? URL.createObjectURL(logo) : upload} alt="" className="object-cover w-20 h-20 rounded-md p-1" />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileChange} />
                    </label>
                    <h2 className="font-bold mt-10 ms-3 text-[#303F58]">Upload Company Logo</h2>
                  </div>
                  {/* Customer website */}
                  <div>
                    <label className="block text-[#303F58] mt-0.5 font-[14px] mb-2">Company Website</label>
                    <input type="text" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Website" />
                  </div>
                </div>
              )}

              {/* Tax preference */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Tax Preference</label>
                <select name="taxPreference" value={formData.taxPreference} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Tax Preference</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
              </div>

              {/* Work phone, WhatsApp number */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Work Phone 2</label>
                  <input type="text" name="workPhone2" value={formData.workPhone2} onChange={handleInputChange} className="w-[308px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter work phone" maxLength={10} pattern="\d{10}" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">
                    WhatsApp Number
                    <input type="checkbox" checked={whatsappSameAsMobile} onChange={handleWhatsappCheckbox} className="mr-1 ms-2" />
                    Same as Work Phone
                  </label>
                  <input type="text" name="whatsappNo" value={formData.whatsappNo} onChange={handleInputChange} className="w-[336px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter WhatsApp number" maxLength={10} pattern="\d{10}" disabled={whatsappSameAsMobile} />
                </div>
              </div>

              {/* Place of supply */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Place of Supply</label>
                <input type="text" name="placeOfSupply" value={formData.placeOfSupply} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Place of supply" required />
              </div>

              {/* Area, Zip Postal Code */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Area</label>
                  <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter area" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Zip Postal Code</label>
                  <input type="text" name="zipPostalCode" value={formData.zipPostalCode} onChange={handleInputChange} className="w-[336px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter zip code" maxLength={6} pattern="\d{6}" />
                </div>
              </div>

              {/* Email, Landmark */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter Email id" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Landmark</label>
                  <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-[337px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Landmark" />
                </div>
              </div>

              {/* Building Number, Street */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Building Number</label>
                  <input type="text" name="buildingNo" value={formData.buildingNo} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter building number" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Street</label>
                  <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="w-[337px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter street" />
                </div>
              </div>

              {/* Main route, Sub route */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Main route</label>
                  <input type="text" name="mainRoute" value={formData.mainRoute} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter main route" required />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Sub Route</label>
                  <input type="text" name="subRoute" value={formData.subRoute} onChange={handleInputChange} className="w-[337px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter sub route" required />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button className="px-3 py-1 mt-8 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]" type="button">
                  Cancel
                </button>
                <button className="px-3 py-1 mt-8 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]" type="submit">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
