import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import back from "../../assets/images/backbutton.svg"
// import upload from "../../assets/images/upload image.svg"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getACustomerAPI, updateCustomerAPI } from "../../services/CustomerAPI/Customer"
import { BASEURL } from "../../services/Baseurl"


interface EditCustomerFormData {
  customerType: string
  companyName: string
  companyWebsite:string
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

export default function EditCustomer() {
  const [formData, setFormData] = useState<EditCustomerFormData>({
    customerType: "Business",
    companyName: "",
    companyWebsite:"",
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

  const { id } = useParams()
  const [logo, setLogo] = useState<File | null>(null)
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getACustomerAPI(id as string) // Await the promise
        console.log(response) // Log the response
        setCustomer(response) // Set the customer state
      } catch (error) {
        console.error("Error fetching customer:", error) // Add error handling
      }
    }

    if (id) {
      fetchCustomer()
    }
  }, [id])

  // Log customer when it updates
  useEffect(() => {
    if (customer) {
      console.log(customer) // This will now log the updated customer state
    }
  }, [customer])

  if (!customer) {
    return <div>Loading customer details...</div> // Display a loading state while customer is being fetched
  }


  console.log(customer);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setCustomer((prevFormData: any) => ({
      ...prevFormData,
      [name]: value, // Update the specific field in formData
    }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      setLogo(file); // Store the file in the local state for preview
    }
  };
  

  const handleWhatsappCheckbox = () => {
    setWhatsappSameAsMobile(!whatsappSameAsMobile)
    setFormData((prev) => ({
      ...prev,
      whatsappNo: !whatsappSameAsMobile ? prev.workPhone : "",
    }))
  }
  

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
  
    // Create a FormData object
    const formDataToUpdate = new FormData();
    formDataToUpdate.append("customerType", customer.customerType);
    formDataToUpdate.append("companyName", customer.companyName);
    formDataToUpdate.append("companyWebsite", customer.companyWebsite);
    formDataToUpdate.append("firstName", customer.firstName);
    formDataToUpdate.append("lastName", customer.lastName);
    formDataToUpdate.append("mobileNo", customer.mobileNo);
    formDataToUpdate.append("workPhone", customer.workPhone);
    formDataToUpdate.append("workPhone2", customer.workPhone2);
    formDataToUpdate.append("whatsappNo", customer.whatsappNo);
    formDataToUpdate.append("currency", customer.currency);
    formDataToUpdate.append("currencyCode", customer.currencyCode);
    formDataToUpdate.append("state", customer.state);
    formDataToUpdate.append("city", customer.city);
    formDataToUpdate.append("billingAddress", customer.billingAddress);
    formDataToUpdate.append("salesman", customer.salesman);
    formDataToUpdate.append("nationality", customer.nationality);
    formDataToUpdate.append("noOfBottles", customer.noOfBottles);
    formDataToUpdate.append("ratePerBottle", customer.ratePerBottle);
    formDataToUpdate.append("depositAmount", customer.depositAmount);
    formDataToUpdate.append("paymentMode", customer.paymentMode);
    formDataToUpdate.append("taxPreference", customer.taxPreference || ''); // Ensure a default value
  
    // Handle the logo file upload using the separate logo state (logoFileName)
    if (logo) {
      formDataToUpdate.append("logo", logo); // Add the logo file name to the form data
    } else {
      console.log('no logo');
    }
  
    // Append other fields
    formDataToUpdate.append("placeOfSupply", customer.placeOfSupply);
    formDataToUpdate.append("area", customer.area);
    formDataToUpdate.append("zipPostalCode", customer.zipPostalCode);
    formDataToUpdate.append("email", customer.email);
    formDataToUpdate.append("landmark", customer.landmark);
    formDataToUpdate.append("buildingNo", customer.buildingNo);
    formDataToUpdate.append("street", customer.street);
    formDataToUpdate.append("mainRoute", customer.mainRoute);
    formDataToUpdate.append("subRoute", customer.subRoute);
  
    try {
      // Call the API with the FormData object
      const response = await updateCustomerAPI(id as string, formDataToUpdate); // Pass FormData
  
      console.log(response);
  
      if (response) {
        setTimeout(() => {
          navigate('/customer')
        },1000)
        toast.success("Customer updated successfully!");
      } else {
        toast.error(response || "Failed to update customer");
      }
    } catch (error) {
      toast.error("An error occurred while updating the customer.");
      console.error("Error updating customer:", error);
    }
  };
  
  
  

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="flex gap-3 items-center w-full max-w-8xl mb-1 ms-1 p-3">
        <Link to="/customer">
          <div className="icon-placeholder">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Edit Customer</h2>
      </div>

      <div className="w-full mx-auto px-10 py-5 bg-white rounded-lg shadow-md">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {/* Customer type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-3">Customer Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="customerType" value={customer.customerType} checked={formData.customerType === "Business"} onChange={handleInputChange} className="mr-2" required />
                    Business
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="customerType" value={customer.customerType} checked={formData.customerType === "Individual"} onChange={handleInputChange} className="mr-2" required />
                    Individual
                  </label>
                </div>
              </div>

              {/* Conditional rendering for company name (if Business is selected) */}
              {formData.customerType === "Business" && (
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Company Name</label>
                  <input type="text" name="companyName" value={customer.companyName} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Company Name" required />
                </div>
              )}

              {/* Primary contact */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Primary Contact</label>
                <div className="grid grid-cols-2 space-x-2">
                  <input type="text" name="firstName" value={customer.firstName} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="First Name" required />
                  <input type="text" name="lastName" value={customer.lastName} onChange={handleInputChange} className="h-[36px] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last Name" required />
                </div>
              </div>

              {/* Mobile number, work phone */}
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Mobile Number</label>
                  <input type="text" name="mobileNo" value={customer.mobileNo} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter mobile" maxLength={10} pattern="\d{10}" required />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Work Phone</label>
                  <input type="text" name="workPhone" value={customer.workPhone} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter work phone" maxLength={10} pattern="\d{10}" />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Currency</label>
                <div className="flex">
                  <input type="text" name="currency" value={customer.currency} onChange={handleInputChange} className="w-[600px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Price" />
                  <input type="text" name="currencyCode" value={customer.currencyCode} onChange={handleInputChange} className="w-[50px] h-[36px] px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="AED" />
                </div>
              </div>

              {/* State, City */}
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">State</label>
                  <input type="text" name="state" value={customer.state} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter state" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">City</label>
                  <input type="text" name="city" value={customer.city} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter city" />
                </div>
              </div>

              {/* Building Address */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Billing Address</label>
                <textarea name="billingAddress" value={customer.billingAddress} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md"></textarea>
              </div>

              {/* Sales Man, Nationality */}
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Sales Man</label>
                  <input type="text" name="salesman" value={customer.salesman} onChange={handleInputChange} className="h-[36px] w-full px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter sales man" required />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Nationality</label>
                  <input type="text" name="nationality" value={customer.nationality} onChange={handleInputChange} className="h-[36px] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter nationality" />
                </div>
              </div>

              {/* Number of bottles, Rate per bottle, Deposit amount */}
              <div className="flex space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Number of bottles</label>
                  <input type="text" name="noOfBottles" value={customer.noOfBottles} onChange={handleInputChange} className="h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter number of bottles" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Rate per bottle</label>
                  <input type="text" name="ratePerBottle" value={customer.ratePerBottle} onChange={handleInputChange} className="px-3 h-[36px] py-2 border rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter rate per bottle" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Deposit Amount</label>
                  <input type="text" name="depositAmount" value={customer.depositAmount} onChange={handleInputChange} className="px-3 h-[36px] py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter deposit amount" />
                </div>
              </div>

              {/* Payment mode */}
              <div className="mt-3">
                <label className="block text-[#303F58] font-[14px] my-2">Payment Mode</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="paymentMode" value="Cash" checked={customer.paymentMode === "Cash"} onChange={handleInputChange} className="mr-2" required />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="paymentMode" value="Credit" checked={customer.paymentMode === "Credit"} onChange={handleInputChange} className="mr-2" required />
                    Credit
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {formData.customerType === "Business" && (
                <div>
                  {/* Uploaded Image */}
                  <div className="flex items-center">
                    <label className="mt-4 border text-[#8F99A9] text-base font-[14px] rounded-lg cursor-pointer">
                      <div className="w-[80px] h-[80px] bg-[#F7E7CE] rounded-lg overflow-hidden">
                        {/* Displaying the Company Logo */}
                        <img src={logo ? URL.createObjectURL(logo) : `${BASEURL}/uploads/${customer.logo}`} alt="Company Logo" className="object-cover w-full h-full" />
                      </div>
                      <input type="file" name="logo" accept="image/*" className="hidden" onChange={handleProfileChange} />
                    </label>
                    <h2 className="font-bold mt-10 ms-3 text-[#303F58]">Upload Company Logo</h2>
                  </div>

                  {/* Customer Website */}
                  <div>
                    <label className="block text-[#303F58] mt-0.5 font-[14px] mb-2">Company Website</label>
                    <input type="text" name="companyWebsite" value={customer.companyWebsite} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Website URL" />
                  </div>
                </div>
              )}

              {/* Tax preference */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Tax Preference</label>
                <select name="taxPreference" value={customer.taxPreference} onChange={handleInputChange} className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Tax Preference</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
              </div>

              {/* Work phone, WhatsApp number */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Work Phone 2</label>
                  <input type="text" name="workPhone2" value={customer.workPhone2} onChange={handleInputChange} className="w-[308px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter work phone" maxLength={10} pattern="\d{10}" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">
                    WhatsApp Number
                    <input type="checkbox" checked={whatsappSameAsMobile} onChange={handleWhatsappCheckbox} className="mr-1 ms-2" />
                    Same as Work Phone
                  </label>
                  <input type="text" name="whatsappNo" value={customer.whatsappNo} onChange={handleInputChange} className="w-[336px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter WhatsApp number" maxLength={10} pattern="\d{10}" disabled={whatsappSameAsMobile} />
                </div>
              </div>

              {/* Place of supply */}
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">Place of Supply</label>
                <textarea name="placeOfSupply" value={customer.placeOfSupply} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-md" placeholder="Place of supply" required></textarea>
              </div>

              {/* Area, Zip Postal Code */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Area</label>
                  <input type="text" name="area" value={customer.area} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter area" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Zip Postal Code</label>
                  <input type="text" name="zipPostalCode" value={customer.zipPostalCode} onChange={handleInputChange} className="w-[336px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter zip code" maxLength={6} pattern="\d{6}" />
                </div>
              </div>

              {/* Email, Landmark */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Email</label>
                  <input type="email" name="email" value={customer.email} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter Email id" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Landmark</label>
                  <input type="text" name="landmark" value={customer.landmark} onChange={handleInputChange} className="w-[337px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Landmark" />
                </div>
              </div>

              {/* Building Number, Street */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Building Number</label>
                  <input type="text" name="buildingNo" value={customer.buildingNo} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter building number" />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Street</label>
                  <input type="text" name="street" value={customer.street} onChange={handleInputChange} className="w-[337px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter street" />
                </div>
              </div>

              {/* Main route, Sub route */}
              <div className="flex">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Main route</label>
                  <input type="text" name="mainRoute" value={customer.mainRoute} onChange={handleInputChange} className="w-[307px] h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500" placeholder="Enter main route" required />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">Sub Route</label>
                  <input type="text" name="subRoute" value={customer.subRoute} onChange={handleInputChange} className="w-[337px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter sub route" required />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button className="px-3 py-1 mt-8 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]" type="button">
                  Cancel
                </button>
                <button onClick={handleUpdate} className="px-3 py-1 mt-8 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]" type="submit">
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
