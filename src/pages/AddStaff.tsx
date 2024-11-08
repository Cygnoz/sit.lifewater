import { useState } from "react";
import { addStaffAPI } from "../services/AllApi";
import back from "../assets/images/backbutton.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
type Props = {};

// function AddStaff({}: Props) {
//   const [mobileNumber, setMobileNumber] = useState<string>("");
//   const [whatsAppNumber, setWhatsAppNumber] = useState("");
//   const [isSameAsPhone, setIsSameAsPhone] = useState(false);
//   const [visaStatus, setVisaStatus] = useState("");
//   const [visaNumber, setVisaNumber] = useState<string>("");
//   const [emiratesId, setEmiratesId] = useState<string>("");
//   const [fullname, setFullname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [address, setAddress] = useState("");
//   const [designation, setDesignation] = useState("");
//   const [visaValidity, setVisaValidity] = useState("");
//   const [profile, setProfile] = useState<File | null>(null);
//   const [nationality, setNationality] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [userName, setUserName] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPassword, setConfirmPassword] = useState<string>("");
//   const [err, setErr] = useState<string>("");

//   console.log(profile);

//   const handleWhatsAppCheckbox = () => {
//     setIsSameAsPhone(!isSameAsPhone);
//     if (!isSameAsPhone) {
//       setWhatsAppNumber(mobileNumber);
//     } else {
//       setWhatsAppNumber("");
//     }
//   };

//   const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setProfile(file); // Set the selected file to state
//       console.log(file); // Log the file for inspection
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const staffData = new FormData();
//     staffData.append("firstname", fullname);
//     staffData.append("lastname", lastname);
//     if (profile) {
//       staffData.append("profile", profile);
//     }
//     staffData.append("address", address);
//     staffData.append(
//       "visaStatus",
//       visaStatus as "Valid" | "Expired" | "In Process"
//     );
//     staffData.append("visaValidity", visaValidity);
//     staffData.append("mobileNumber", mobileNumber);
//     staffData.append("whatsAppNumber", whatsAppNumber);
//     staffData.append("visaNumber", visaNumber);
//     staffData.append("dateofBirth", dateOfBirth);
//     staffData.append("nationality", nationality);
//     staffData.append(
//       "designation",
//       designation as "Sales" | "Driver" | "Helper"
//     );
//     staffData.append("emiratesId", emiratesId);
//     staffData.append("username", userName);
//     staffData.append("password", password);
//     staffData.append("confirmPassword", confirmPassword);

//     try {
//       const response = await addStaffAPI(staffData);
//       if (response.message) {
//         setError(response.message);
//         console.log(response.message);
//       } else {
//         clearForm();
//         setSuccessMessage("Staff added successfully!");
//       }
//     } catch (error) {
//       setError("An error occurred while adding the staff member.");
//     }
//   };

//   const clearForm = () => {
//     setFullname("");
//     setLastname("");
//     setDateOfBirth("");
//     setMobileNumber("");
//     setWhatsAppNumber("");
//     setVisaStatus("");
//     setVisaNumber("");
//     setVisaValidity("");
//     setNationality("");
//     setAddress("");
//     setEmiratesId("");
//     setDesignation("");
//     setError("");
//     setUserName("")
//     setPassword("")
//     setSuccessMessage("");
//     setProfile(null);
//     setIsSameAsPhone(false);
//   };

function AddStaff({}: Props) {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [isSameAsPhone, setIsSameAsPhone] = useState(false);
  const [visaStatus, setVisaStatus] = useState("");
  const [visaNumber, setVisaNumber] = useState<string>("");
  const [emiratesId, setEmiratesId] = useState<string>("");
  const [fullname, setFullname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [designation, setDesignation] = useState("");
  const [visaValidity, setVisaValidity] = useState("");
  const [profile, setProfile] = useState<File | null>(null);
  const [nationality, setNationality] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const handleWhatsAppCheckbox = () => {
    setIsSameAsPhone(!isSameAsPhone);
    if (!isSameAsPhone) {
      setWhatsAppNumber(mobileNumber);
    } else {
      setWhatsAppNumber("");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfile(file); // Set the selected file to state
      console.log(file); // Log the file for inspection
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const staffData = new FormData();
    staffData.append("firstname", fullname);
    staffData.append("lastname", lastname);
    if (profile) {
      staffData.append("profile", profile);
    }
    staffData.append("address", address);
    staffData.append("visaStatus", visaStatus as "Valid" | "Expired" | "In Process");
    staffData.append("visaValidity", visaValidity);
    staffData.append("mobileNumber", mobileNumber);
    staffData.append("whatsAppNumber", whatsAppNumber);
    staffData.append("visaNumber", visaNumber);
    staffData.append("dateofBirth", dateOfBirth);
    staffData.append("nationality", nationality);
    staffData.append("designation", designation as "Sales" | "Driver" | "Helper");
    staffData.append("emiratesId", emiratesId);
    staffData.append("username", userName);
    staffData.append("password", password);
    staffData.append("confirmPassword", confirmPassword);

    try {
      const response = await addStaffAPI(staffData);
      if (response.message) {
        toast.error(response.message); // Display error toast
        console.log(response.message);
      } else {
        clearForm();
        toast.success("Staff added successfully!"); // Display success toast
      }
    } catch (error) {
      toast.error("An error occurred while adding the staff member."); // Display error toast
    }
  };

  const clearForm = () => {
    setFullname("");
    setLastname("");
    setDateOfBirth("");
    setMobileNumber("");
    setWhatsAppNumber("");
    setVisaStatus("");
    setVisaNumber("");
    setVisaValidity("");
    setNationality("");
    setAddress("");
    setEmiratesId("");
    setDesignation("");
    setUserName("");
    setPassword("");
    setProfile(null);
    setIsSameAsPhone(false);
    setConfirmPassword("");
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
         // optional CSS class for further styling
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
                <div className="flex flex-col items-start ">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        profile
                          ? URL.createObjectURL(profile)
                          : "https://via.placeholder.com/100"
                      }
                      alt={profile ? profile.name : "Profile"}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <label className="ml-4 p-2 border border-gray-300 rounded-lg cursor-pointer text-gray-700">
                      Upload New Photo
                      <input
                        type="file"
                        onChange={handleProfileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 text-center ml-1 mx-20">
                    At least 800 x 800 px Recommended. JPG or PNG is Allowed
                  </p>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={mobileNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                      if (value.length <= 10) {
                        setMobileNumber(value); // Set only if it's 10 digits or less
                      }
                    }}
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
                    value={whatsAppNumber}
                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                    className="mt-1 p-2 h-[36px] border border-gray-300 rounded-lg w-full"
                    placeholder="Enter WhatsApp number"
                    disabled={isSameAsPhone}
                  />
                </div>

                {/* Visa Status (Dropdown) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Visa Status *
                  </label>
                  <select
                    required
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                    value={visaStatus}
                    onChange={(e) => setVisaStatus(e.target.value)}
                  >
                    <option  value="">Enter Visa Status</option>
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
                    value={visaNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                      if (value.length <= 10) {
                        setVisaNumber(value); // Set only if it's 10 digits or less
                      }
                    }}
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
                    value={emiratesId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                      if (value.length <= 15) {
                        setEmiratesId(value); // Set only if it's 15 digits or less
                      }
                    }}
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
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
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
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
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
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  
                  <textarea
                    
                    
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 p-2  border border-gray-300 rounded-lg w-full"
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
                        checked={designation === "Sales"}
                        onChange={(e) => setDesignation(e.target.value)}
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
                        checked={designation === "Driver"}
                        onChange={(e) => setDesignation(e.target.value)}
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
                        checked={designation === "Helper"}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="form-radio"
                      />
                      <span className="ml-2">Helper</span>
                    </label>
                  </div>

                  {/* Conditionally render input fields based on the selected designation */}
                  {designation === "Sales" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        required
                        type="text"
                        className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                        placeholder=" Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-1">
                        <div className="mt-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <input
                            required
                            type="password"
                            className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        <div className="mt-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <input
                            required
                            type="password"
                            className="mt-1 h-[36px] p-2 border border-gray-300 rounded-lg w-full"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const value = e.target.value; // Allow any character input
                              setConfirmPassword(value); // Always update confirmPassword with the typed value
                            }}
                            onBlur={() => {
                              if (confirmPassword !== password) {
                                setErr("Passwords do not match"); // You can also show an error message here
                              } else {
                                setErr(""); // Clear the error if passwords match
                              }
                            }}
                          />
                          {err && (
                            <p className="text-red-500 text-sm mt-1">{err}</p>
                          )}
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
                    value={visaValidity}
                    onChange={(e) => setVisaValidity(e.target.value)}
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
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
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
                  onClick={clearForm}
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

