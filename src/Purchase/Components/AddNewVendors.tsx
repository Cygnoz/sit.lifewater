import { Link } from "react-router-dom";
import back from "../../assets/images/backbutton.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddNewVendors() {
  return (
    <div>
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
      <div className="flex gap-3 items-center w-full max-w-8xl  ms-1 p-3">
        <Link to="/suppliers">
          <div className="icon-placeholder">
            <img
              className="bg-gray-200 rounded-full p-2"
              src={back}
              alt="Back"
            />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">
          Add New Suppliers
        </h2>
      </div>

      <div className="w-full mx-auto  px-10 py-5 bg-white rounded-lg shadow-md">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {/* Customer type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-3 mb-3">
                  Customer Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="Business"
                      required
                      className="me-2"
                    />
                    Business
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="Individual"
                      className="me-2"
                    />
                    Individual
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                  placeholder="Company Name"
                  required
                />{" "}
              </div>

              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Vendor Website
                </label>
                <div className="">
                  <input
                    type="text"
                    className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                    placeholder=" Vendor Website"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Payment Terms
                </label>
                <input
                  type="text"
                  className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Primary Contact
                </label>
                <div className="grid grid-cols-2 space-x-2">
                  <input
                    type="text"
                    className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="workPhone"
                    className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Second Name"
                  />
                </div>
                <div></div>
              </div>
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                    placeholder="  Mobile Number"
                    maxLength={10}
                    pattern="\d{10}"
                  />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    name="workPhone"
                    className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Work Phone 01"
                    maxLength={10}
                    pattern="\d{10}"
                  />
                </div>
              </div>
              <div className="">
                <input
                  type="text"
                  className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                  placeholder="Work Phone 02"
                  maxLength={10}
                  pattern="\d{10}"
                />
              </div>
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Currency
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="currency"
                    className="w-[600px] h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Price"
                  />
                  <input
                    type="text"
                    name="currencyCode"
                    className="w-[50px] h-[36px] px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="AED"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 space-x-2">
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="w-full h-[36px] px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-[#303F58] font-[14px] mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="w-full h-[36px] px-3 mb-5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <div>
                  <label className="block text-[#303F58] mt-0.5 font-[14px] mb-2">
                    Vendor Email
                  </label>
                  <input
                    type="text"
                    name="customerWebsite"
                    className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Website"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Tax Preference
                </label>
                <select
                  name="taxPreference"
                  className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Tax Preference</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
              </div>
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Zip Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter zip code"
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>

              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Place of Supply
                </label>
                <input
                  type="text"
                  name="placeOfSupply"
                  className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Place of supply"
                />
              </div>
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Billing Address
                </label>
                <textarea
                  name="billingAddress"
                  className="w-full border border-gray-300 p-2 rounded-md"
                ></textarea>
              </div>
              <div>
                <label className="block text-[#303F58] font-[14px] mb-2">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  className="w-full h-[36px] px-3 py-2 mb-3 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                  placeholder="Enter area"
                />
              </div>

              <div className="">
                <label className="block text-[#303F58]  font-[14px] mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="buildingNumber"
                  className="w-full h-[36px]  px-3 py-2 border me-5 rounded-md focus:outline-none focus:ring-2 gap-[126px] focus:ring-blue-500"
                  placeholder="Enter building number"
                />
              </div>

              <div className="flex justify-end">
              <Link to="/suppliers">
                <button
                  className="px-3 py-1 mt-10 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]"
                  type="button"
                >
                  Cancel
                </button></Link>
                <button
                  className="px-3 py-1 mt-10 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
