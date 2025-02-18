import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import back from "../../assets/images/backbutton.svg";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

export default function EditSupplier() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get supplier ID from URL params
  const { request: getSupplier } = useApi("get", 4001);
  const { request: editSupplier } = useApi("put", 4001);

  const [formData, setFormData] = useState({
    fullName: "",
    customerType: "",
    companyName: "",
    vendorWebsite: "",
    paymentTerms: "",
    
      firstName: "",
      lastName: "",
   
    mobileNumber: "",
    customerPhone: {
        workPhone01: "",
        workPhone02: "",
    },
    currency: "",
    state: "",
    city: "",
    vendorEmail: "",
    taxPreference: "",
    zipPostalCode: "",
    placeOfSupply: "",
    billingAddress: "",
    area: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch supplier details
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const url = `${endpoints.GET_A_SUPPLIER}/${id}`;
        const { response, error } = await getSupplier(url);

        if (!error && response) {
          setFormData(response.data?.data);
          console.log("Supplier data:", response.data?.data);

          
        } else {
          toast.error(error?.response?.data?.message || "Failed to fetch supplier.");
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
        toast.error("An unexpected error occurred.");
      }
    };

    if (id) fetchSupplier();
  }, [id]);

 

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (e: any, parentKey: string) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [parentKey]: {
        ...prevData[parentKey],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${endpoints.EDIT_SUPPLIER}/${id}`;
      const { response, error } = await editSupplier(url, formData);

      if (!error && response) {
        toast.success("Supplier updated successfully.");
        setTimeout(() => navigate("/suppliers"), 1000);
      } else {
        toast.error(error?.response?.data?.message || "Failed to update supplier.");
      }
    } catch (err) {
      console.error("Error updating supplier:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <div className="flex gap-3 items-center w-full max-w-8xl ms-1 p-3">
        <Link to="/suppliers">
          <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Edit Supplier</h2>
      </div>
      <div className="w-full mx-auto px-10 py-5 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
            <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Customer Type
                </label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  className="w-full h-[36px] px-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Customer Type</option>
                  <option value="Business">Business</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div>
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              

              <div>
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  required
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Vendor website</label>
                <input
                  type="text"
                  name="vendorWebsite"
                  value={formData.vendorWebsite}
                  onChange={handleChange}
                  placeholder="Vendor Website"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Billing Address</label>
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  placeholder="billingAddress"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Payment Terms</label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  placeholder="Payment Terms"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>

             <div>
                <h2 className="font-semibold">Primary Contact </h2>
               

              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>

              <div>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              </div> 
            </div>
            <div className="space-y-4">
              <div>
  <label>Work phone 1</label>
  <input
    type="text"
    name="workPhone01" // Match the API response key
    value={formData.customerPhone?.workPhone01 || ""}
    onChange={(e) => handleNestedChange(e, "customerPhone")}
    placeholder="Work Phone 1"
    className="w-full h-[36px] px-3 border rounded-md"
  />
</div>
<div>
  <label>Work phone 2</label>
  <input
    type="text"
    name="workPhone02" // Match the API response key
    value={formData.customerPhone?.workPhone02 || ""}
    onChange={(e) => handleNestedChange(e, "customerPhone")}
    placeholder="Work Phone 2"
    className="w-full h-[36px] px-3 border rounded-md"
  />
</div>

              <div>
                <label>Vendor Email</label>
                <input
                  type="text"
                  name="vendorEmail"
                  value={formData.vendorEmail}
                  onChange={handleChange}
                  placeholder="Vendor Email"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="area"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Zip Postal Code</label>
                <input
                  type="text"
                  name="zipPostalCode"
                  value={formData.zipPostalCode}
                  onChange={handleChange}
                  placeholder="zipPostalCode"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Place Of Supply</label>
                <input
                  type="text"
                  name="placeOfSupply"
                  value={formData.placeOfSupply}
                  onChange={handleChange}
                  placeholder="placeOfSupply"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
              <div>
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="w-full h-[36px] px-3 border rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Link to="/suppliers">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-red-900 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
