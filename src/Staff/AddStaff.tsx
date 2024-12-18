import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import back from "../assets/images/backbutton.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import upload from "../assets/images/addStaffFrame.jpg"
import Button from "../commoncomponents/Buttons/Button";
import Eye from "../assets/icons/Eye"
import EyeOffIcon from "../assets/icons/EyeOffIcon"
interface StaffData {
  mobileNumber: string;
  whatsAppNumber: string;
  visaStatus: string;
  visaNumber: string;
  emiratesId: string;
  firstname: string;
  lastname: string;
  dateofBirth: string;
  address: string;
  designation: string;
  profile: string;
  nationality: string;
  username: string;
  password: string;
  confirmPassword: string;
  visaValidity: string;
}
type Props = {};

function AddStaff({ }: Props) {

  const { request: addStaff } = useApi("post", 4000);
  const [isSameAsPhone, setIsSameAsPhone] = useState(false);
  const [initialStaffData, setInitialStaffData] = useState<StaffData>(
    {
      address: "",
      confirmPassword: "",
      dateofBirth: "",
      designation: "",
      emiratesId: "",
      firstname: "",
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
  const [errorMessage, setErrorMessage] = useState("");
  console.log(initialStaffData);
  const { id } = useParams();
  const isEditing = Boolean(id);
  console.log(id, "id");
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setInitialStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Check if passwords match
    if (name === "confirmPassword" || name === "password") {
      const updatedPassword = name === "password" ? value : initialStaffData.password;
      const updatedConfirmPassword =
        name === "confirmPassword" ? value : initialStaffData.confirmPassword;
      setErrorMessage(
        updatedPassword !== updatedConfirmPassword ? "Passwords do not match" : ""
      );
    }
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
  const { request: getStaff } = useApi("get", 4000);
  const [staffData, SetStaffData] = useState()

  // Fetch staff data for editing
  const getAnStaff = async () => {
    const url = `${endpoints.GET_AN_STAFF}/${id}`;
    try {
      const { response, error } = await getStaff(url);
      if (!error && response) {
        SetStaffData(response.data);
        console.log(staffData);
        setInitialStaffData({
          ...initialStaffData,
          ...response.data,
          confirmPassword: response.data.password,
          visaValidity: response.data.visaValidity?.slice(0, 10), // Format date for input field
          dateofBirth: response.data.dateofBirth?.slice(0, 10),
        });
      }
      console.log(response?.data, "staffData");
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  // Initialize data if editing
  useEffect(() => {
    if (isEditing) {
      getAnStaff();
    }
  }, [id]);

  // Watch for changes in designation and reset username/password if needed
  useEffect(() => {
    if (initialStaffData.designation !== "Sales") {
      setInitialStaffData((prevData) => ({
        ...prevData,
        username: "",
        password: "",
        confirmPassword: "", // Also clear confirmPassword for consistency
      }));
    }
  }, [initialStaffData.designation]);

  const { request: editStaff } = useApi("put", 4000);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Validate passwords before saving or submitting
    if (
      initialStaffData.designation === "Sales" &&
      initialStaffData.password !== initialStaffData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return; // Stop submission if passwords don't match
    }

    // Prepare the data to be sent to the backend
    const dataToSubmit = {
      ...initialStaffData,
      username: initialStaffData.designation === "Sales" ? initialStaffData.username : "",
      password: initialStaffData.designation === "Sales" ? initialStaffData.password : "",
    };

    const url = isEditing
      ? `${endpoints.EDIT_STAFF}/${id}`
      : `${endpoints.ADD_STAFF}`;

    try {
      const { response, error } = isEditing
        ? await editStaff(url, dataToSubmit)
        : await addStaff(url, dataToSubmit);

      if (!error && response) {
        toast.success(
          isEditing
            ? "Staff updated successfully."
            : `${response.data.message}`
        );

        if (!isEditing) {
          setInitialStaffData(dataToSubmit); // Reset form after adding
        }
        if (isEditing) {
          setTimeout(() => {
            navigate("/staff"); // Navigate to staff page after 2 seconds
          }, 2000);
        }
      } else {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error submitting staff data:", error);
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
          <h2 className="text-2xl font-bold">{isEditing ? "Edit Staff" : "Create New Staff"} </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-8xl w-full mx-1">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="col-span-2">
                  <div className="rounded-lg items-center  flex text-center">
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
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numeric characters
                      if (/^\d*$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                    maxLength={15}
                    placeholder="Enter Mobile"
                    title="Please enter exactly 15 digits"
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
                    type="tel"
                    required
                    name="whatsAppNumber"
                    value={initialStaffData.whatsAppNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numeric characters
                      if (/^\d*$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    className="mt-1 p-2 h-[36px] border border-gray-300 rounded-lg w-full"
                    placeholder="Enter WhatsApp number"
                    disabled={isSameAsPhone}
                    maxLength={15}
                    title="Please enter exactly 15 digits"
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
                    name="dateofBirth"
                    value={initialStaffData.dateofBirth}
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
                <div >
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
                      <div className="grid grid-cols-2 mt-2 gap-2">
                        {/* Password Field */}
                        <div className=" relative">
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <div className="relative h-[48px]"> {/* Add fixed height */}
                            <input
                              required
                              type={showPassword ? "text" : "password"} // Toggle input type
                              name="password"
                              className="h-[36px] p-2 border border-gray-300 mt-1 rounded-lg w-full pr-10"
                              placeholder="Password"
                              value={initialStaffData.password}
                              onChange={handleInputChange}
                            />
                            <div
                              className="absolute inset-y-0 right-3 flex mt-[-10px] items-center cursor-pointer"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <Eye color="#4B5C79" size={18} />
                              ) : (
                                <EyeOffIcon color="#4B5C79" size={18} />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <div className="relative h-[48px]"> {/* Add fixed height */}
                            <input
                              required
                              type={showConfirmPassword ? "text" : "password"} // Toggle input type
                              name="confirmPassword"
                              className="h-[36px] p-2 border border-gray-300 mt-1 rounded-lg w-full pr-10"
                              placeholder="Confirm Password"
                              value={initialStaffData.confirmPassword}
                              onChange={handleInputChange}
                            />
                            <div
                              className="absolute inset-y-0 right-3 mt-[-10px] flex items-center cursor-pointer"
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {showConfirmPassword ? (
                                <Eye color="#4B5C79" size={18} />
                              ) : (
                                <EyeOffIcon color="#4B5C79" size={18} />
                              )}
                            </div>
                            {errorMessage && (
                              <p className="text-red-500 text-sm pt-1 absolute -bottom-5">
                                {errorMessage}
                              </p>
                            )}
                          </div>
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

            <div className="mt-6 flex justify-end gap-2">
              <Link to={"/staff"}>
                <Button variant="fourthiary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStaff;

