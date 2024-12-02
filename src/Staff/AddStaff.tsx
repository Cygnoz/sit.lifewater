import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import back from "../assets/images/backbutton.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { StaffResponseContext } from "../Context/ContextShare";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import upload from "../assets/images/addStaffFrame.jpg"
type Props = {};

interface StaffData {
  mobileNumber: string;
  whatsAppNumber: string;
  isSameAsPhone: string;
  visaStatus: string;
  visaNumber: string;
  emiratesId: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  address: string;
  designation: string;
  profile: string;
  nationality: string;
  username: string;
  password: string;
  confirmPassword: string;
  visaValidity: string;
}

function AddStaff({ }: Props) {
  const { request: addStaff } = useApi("post", 4000);
  const [isSameAsPhone, setIsSameAsPhone] = useState(false);
  const { staffResponse } = useContext(StaffResponseContext)!;
  const [initialStaffData, setInitialStaffData] = useState<StaffData>(
    {
      address: "",
      confirmPassword: "",
      dateOfBirth: "",
      designation: "",
      emiratesId: "",
      firstname: "",
      isSameAsPhone: "",
      lastname: "",
      mobileNumber: "",
      nationality: "",
      password: "",
      profile: "",
      username: "",
      visaNumber: "",
      visaStatus: "",
      visaValidity: "",
      whatsAppNumber: "",
    }
  );
  console.log(initialStaffData);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, } = event.target;

    setInitialStaffData({ ...initialStaffData, [name]: value })
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInitialStaffData((prevDetails: any) => ({
          ...prevDetails,
          profile: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppCheckbox = () => {
    setIsSameAsPhone((prevState) => {
      const newState = !prevState;

      setInitialStaffData((prevDetails: any) => ({
        ...prevDetails,
        whatsAppNumber: newState ? prevDetails.mobileNumber : "", // Copy mobileNumber or reset
      }));

      return newState;
    });
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const url = `${endpoints.ADD_STAFF}`;
    try {
      const { response, error } = await addStaff(url, initialStaffData);
      if (!error && response) {
        toast.success(response?.data.message);
      }
      // setStaffData(initialStaffDataState); // Reset form
      console.log(response);

    } catch (error) {
      toast.error("Failed to save staff.");
      console.log(error);
    }
  };



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
      <div className="min-h-screen bg-gray-100 items-center justify-center ">
        <div className="flex gap-3 items-center w-full max-w-8xl mt-2 mb-2 ms-1">
          <Link to={"/staff"}>
            <div className="icon-placeholder">
              <img className="bg-gray-200 rounded-full p-2" src={back} alt="" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold">Create New Staff</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-8xl w-full mx-1">


          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="col-span-2">
                  <div className="    rounded-lg items-center  flex text-center">
                    <label htmlFor="image">
                      <div className="flex">
                        <div
                          className={`bg-lightPink flex items-center justify-center h-16 w-36 rounded-lg ${initialStaffData.profile ? "h-[90px] rounded-b-none" : ""
                            }`}
                        >
                          {initialStaffData.profile ? (
                            <img
                              src={initialStaffData.profile}
                              alt="Item"
                              className="max-h-20 max-w-40"
                            />
                          ) : (
                            <img
                              src={upload}
                              alt=""
                              className="object-cover cursor-pointer rounded-md"
                            />
                          )}
                        </div>
                        <div className=" mt-2">
                          <div className="text-[#565148] cursor-pointer border border-[#565148] text-[12px] w-32 rounded-lg px-3 py-1.5 h-8 " >
                            Upload Staff Image
                          </div>
                          <p className="text-[#4B5C79] text-[12px] pt-1">At least 800 x 800 px Recommended. JPG or PNG is Allowed</p>
                        </div>
                      </div>

                      <input
                        type="file"
                        id="image"
                        className="hidden"
                        name="profile"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={initialStaffData.mobileNumber}
                    name="mobileNumber"
                    onChange={handleInputChange}
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                    maxLength={10}
                    pattern="\d{10}" // Regex pattern to enforce exactly 10 digits
                    placeholder="Enter Mobile"
                    title="Please enter exactly 10 digits"
                  />
                </div>

                {/* WhatsApp Number with Checkbox */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    WhatsApp Number *
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="checkbox"

                      checked={isSameAsPhone}
                      onChange={handleWhatsAppCheckbox}
                      className="form-checkbox h-4 w-4 text-red-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Same as phone number
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    name="whatsAppNumber"
                    value={initialStaffData.whatsAppNumber}
                    onChange={handleInputChange}
                    className="mt-1 p-2 h-[36px] border border-gray-300 rounded-lg w-full"
                    placeholder="Enter WhatsApp number"
                    disabled={isSameAsPhone}
                  />
                </div>

                {/* Visa Status (Dropdown) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Visa Status
                  </label>
                  <select
                    name="visaStatus" // Name attribute is crucial for dynamic updates
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                    value={initialStaffData.visaStatus} // Controlled input
                    onChange={handleInputChange}
                  >
                    <option value="">Enter Visa Status</option>
                    <option value="Valid">Valid</option>
                    <option value="Expired">Expired</option>
                    <option value="In Process">In Process</option>
                  </select>
                </div>

                {/* Visa Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Visa Number
                  </label>
                  <input

                    type="tel" // Use "tel" to allow numeric input
                    value={initialStaffData.visaNumber}
                    name="visaNumber"
                    onChange={handleInputChange}
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                    maxLength={10} // Limits the number of characters to 10
                    pattern="\d{10}" // Ensures that exactly 10 digits are entered
                    placeholder="Enter Visa Number"
                    title="Please enter exactly 10 digits"
                  />
                </div>

                {/* Emirates ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Emirates ID
                  </label>
                  <input

                    type="tel" // Use "tel" to allow numeric input
                    value={initialStaffData.emiratesId}
                    onChange={handleInputChange}
                    name="emiratesId"
                    className="mt-1 p-2 border h-[36px] border-gray-300 rounded-lg w-full"
                    maxLength={15} // Limits the number of characters to 15
                    pattern="\d{15}" // Ensures that exactly 15 digits are entered
                    placeholder="Enter Emirates ID"
                    title="Please enter exactly 15 digits"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>

                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="firstname"
                      value={initialStaffData.firstname}
                      onChange={handleInputChange}
                      className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                      placeholder="Enter First Name"
                    />
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input

                      type="text"
                      name="lastname"
                      value={initialStaffData.lastname}
                      onChange={handleInputChange}
                      className="mt-1 p-2  h-[36px] border border-gray-300 rounded-lg w-full"
                      placeholder="Enter Last Name"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input

                    type="date"
                    name="dateOfBirth"
                    value={initialStaffData.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address" // Add the name attribute to match the property in state
                    value={initialStaffData.address} // Bind the correct state property
                    onChange={handleInputChange} // Reuse the existing handler
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    placeholder="Enter Address"
                  ></textarea>
                </div>

                {/* designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation *
                  </label>
                  <div className="flex flex-col space-y-1 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        required
                        type="radio"
                        name="designation"
                        value="Sales"
                        checked={initialStaffData.designation === "Sales"}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span className="ml-2">Salesman</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        required
                        type="radio"
                        name="designation"
                        value="Driver"
                        checked={initialStaffData.designation === "Driver"}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span className="ml-2">Driver</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        required
                        type="radio"
                        name="designation"
                        value="Helper"
                        checked={initialStaffData.designation === "Helper"}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span className="ml-2">Helper</span>
                    </label>
                  </div>

                  {/* Conditionally render input fields based on the selected designation */}
                  {initialStaffData.designation === "Sales" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        required
                        type="text"
                        name="username"
                        className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                        placeholder="Username"
                        value={initialStaffData.username}
                        onChange={handleInputChange}
                      />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="mt-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <input
                            required
                            type="password"
                            name="password"
                            className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Password"
                            value={initialStaffData.password}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="mt-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <input
                            required
                            type="password"
                            name="confirmPassword"
                            className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Confirm Password"
                            value={initialStaffData.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visa Validity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Visa Validity
                  </label>
                  <input
                    type="date"
                    name="visaValidity"
                    value={initialStaffData.visaValidity}
                    onChange={handleInputChange}
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block  text-sm font-medium text-gray-700">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={initialStaffData.nationality}
                    onChange={handleInputChange}
                    className="mt-3 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                    placeholder="Enter Nationality"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="me-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              // onClick={clearForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#820000] rounded-lg text-white"
              >
                Submit
              </button>
              <Link to={"/staff"}>

              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStaff;
