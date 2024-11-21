import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import back from "../../assets/images/backbutton.svg"
import upload from "../../assets/images/upload image.svg"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { addCustomerAPI } from "../../services/CustomerAPI/Customer"
import { getSubRoutesAPI } from "../../services/RouteAPI/subRouteAPI"

interface CustomerFormData {
  fullName: string
  customerType: string
  mobileNo: string
  addressLine1: string
  addressLine2: string
  whatsappNumber: string
  city: string
  flatNumber: string
  numberOfBottles: number
  ratePerBottle: string
  depositAmount: string
  paymentMode: string
  zipPostalCode: string
  street: string
  mainRoute: string
  subRoute: string
  logo:string
}

interface Route {
  _id: string;
  subRoute: string;
  mainRoute: string;
}

export default function AddCustomer() {
  const [formData, setFormData] = useState<CustomerFormData>({
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
    logo:""
  })

  const [logo, setLogo] = useState("")
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false)
  const [routesList, setRouteList] = useState<Route[]>([]);
  const [mainRouteList, setMainRouteList] = useState<string[]>([]);
  const [selectedMainRoute, setSelectedMainRoute] = useState<string>('');
  const [selectedSubRoute, setSelectedSubRoute] = useState<string>('');
  const [filteredSubRoutes, setFilteredSubRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const fetchSubRoutes = async () => {
      try {
        const response = await getSubRoutesAPI();
        setRouteList(response);
        const uniqueMainRoutes: string[] = Array.from(new Set(response.map((route: Route) => route.mainRoute)));
        setMainRouteList(uniqueMainRoutes);
      } catch (error) {
        console.error('Error fetching sub-route data:', error);
      }
    };
  
    fetchSubRoutes();
  }, []);

  const handleMainRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mainRoute = event.target.value;
    setSelectedMainRoute(mainRoute);
    setFilteredSubRoutes(routesList.filter(route => route.mainRoute === mainRoute));
    setSelectedSubRoute('');
  };
   
  const handleSubRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubRoute(event.target.value);
  };

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
      whatsappNumber: !whatsappSameAsMobile ? prev.mobileNo : "",
    }))
  }

  const clearForm = () => {
    setFormData({
      customerType: "Business",
      fullName: "",
      mobileNo: "",
      addressLine1: "",
      addressLine2: "",
      whatsappNumber: "",
      city: "",
      flatNumber: "",
      numberOfBottles: 0,
      ratePerBottle: "",
      depositAmount: "",
      paymentMode: "Cash",
      zipPostalCode: "",
      street: "",
      mainRoute: "",
      subRoute: "",
      logo:""
    })
    setLogo("")
    setWhatsappSameAsMobile(false)
    setSelectedMainRoute('')
    setSelectedSubRoute('')
  }
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const file = event.target.files?.[0];    
    if (file) {      
      const reader = new FileReader();       
      reader.onloadend = () => {        
        setLogo(reader.result as string); // Cast to string
      }; 
      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const customerData = {
      ...formData,
      mainRoute: selectedMainRoute,
      subRoute: selectedSubRoute,
      logo:logo
    }
    if (logo) {
      const formDataWithLogo = new FormData()
      formDataWithLogo.append('logo', logo)
      
      Object.entries(customerData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formDataWithLogo.append(key, value?.toString())
        }
      })
      try {
        const response = await addCustomerAPI(customerData)
        handleApiResponse(response)
      } catch (error: any) {
        handleApiError(error)
      }
    }
  }

  const handleApiResponse = (response: any) => {
    console.log("Response:", response)
    if (response.status === 201) {
      toast.success(response.message || "Customer added successfully")
      clearForm()
    } else {
      toast.error(response.message || "Failed to add customer. Please try again.")
    }
  }

  const handleApiError = (error: any) => {
    console.error("Error submitting the form:", error)
    toast.error(error.message || "Failed to add customer. Please try again.")
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
          <div className="flex gap-6">
            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-52">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center bg-orange-50 rounded-lg py-4 px-6">
                  {logo ? (
                    <img src={logo} alt="Uploaded Logo" className="object-cover w-20 h-20 rounded-md" />
                  ) : (
                    <img src={upload} alt="" />
                  )}
                  <span className="text-gray-700 font-semibold text-base">{logo ? "Change Image" : "Add Image"}</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <h2 className="text-gray-800 font-bold mt-2">Upload Company Logo</h2>
              <p className="text-gray-500 text-sm">Support: JPG, PNG</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="col-span-2">
                <h3 className="text-gray-800 font-bold mb-2">Basic Details</h3>
              </div>

              <div className="col-span-1">
                <label className="block text-[#303F58] font-medium text-sm mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full h-[36px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Full Name" />
              </div>

              <div className="col-span-1">
                <label className="block text-[#303F58] font-medium text-sm mb-1">Customer Type</label>
                <select name="customerType" value={formData.customerType} onChange={handleInputChange} className="w-full h-[36px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select customer type</option>
                  <option value="Business">Business</option>
                  <option value="Individual">Individual</option>
                  <option value="Villa">Villa</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[#303F58] font-medium text-sm mb-1">Mobile Number</label>
                <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} className="w-full h-[36px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter mobile" maxLength={14} />
              </div>

              <div className="col-span-1">
                <label className="block text-[#303F58] font-medium text-sm mb-1">
                  WhatsApp Number
                  <input type="checkbox" checked={whatsappSameAsMobile} onChange={handleWhatsappCheckbox} className="ml-2" />
                  <span className="ml-1 text-gray-500 text-xs">Same as Mobile Number</span>
                </label>
                <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} className="w-full h-[36px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter WhatsApp number" maxLength={14} disabled={whatsappSameAsMobile} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h3 className="text-gray-800 font-bold mb-2">Address</h3>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address 1
                </label>
                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Enter address" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex-1">
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address 2
                </label>
                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Enter address 2" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Enter street" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Flat number
              </label>
              <input type="text" name="flatNumber" value={formData.flatNumber} onChange={handleInputChange} placeholder="Enter flat number" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                Zip Postal Code
              </label>
              <input type="text" name="zipPostalCode" value={formData.zipPostalCode} onChange={handleInputChange} placeholder="Enter zip code" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h3 className="text-gray-800 font-bold mb-2">Additional Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="bottles" className="block text-sm font-medium text-gray-700 mb-1">
                Number of bottles
              </label>
              <input type="text" name="numberOfBottles" value={formData.numberOfBottles} onChange={handleInputChange} placeholder="Enter number of bottles" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                Rate per bottle
              </label>
              <input type="text" name="ratePerBottle" value={formData.ratePerBottle} onChange={handleInputChange} placeholder="Enter rate" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-1">
                Deposit amount
              </label>
              <input type="text" name="depositAmount" value={formData.depositAmount} onChange={handleInputChange} placeholder="Enter deposit amount" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment mode</label>
              <div className="flex space-x-4 mt-1">
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMode" value="Cash" checked={formData.paymentMode === "Cash"} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Cash</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMode" value="Credit" checked={formData.paymentMode === "Credit"} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Credit</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMode" value="Coupon" checked={formData.paymentMode === "Coupon"} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Coupon</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="main-route" className="text-sm font-medium text-gray-700">
                Main Route
              </label>
              <select
                id="main-route"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedMainRoute}
                onChange={handleMainRouteChange}
              >
                <option value="">Select Main Route</option>
                {mainRouteList.map((mainRoute) => (
                  <option key={mainRoute} value={mainRoute}>
                    {mainRoute}
                  </option>
                ))}
              </select>
            </div>
   
            <div className="space-y-1">
              <label htmlFor="sub-route" className="text-sm font-medium text-gray-700">
                Sub Route
              </label>
              <select
                id="sub-route"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedSubRoute}
                onChange={handleSubRouteChange}
                disabled={!selectedMainRoute}
              >
                <option value="">Select Sub Route</option>
                {filteredSubRoutes.map((route) => (
                  <option key={route._id} value={route.subRoute}>
                    {route.subRoute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-3 py-1 mt-8 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]" type="button" onClick={clearForm}>
              Cancel
            </button>
            <button className="px-3 py-1 mt-8 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}