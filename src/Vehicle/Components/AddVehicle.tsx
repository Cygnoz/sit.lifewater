import React, {  useState } from 'react';
import upload from '../../assets/images/upload image.svg'
import { Link } from 'react-router-dom';
import back from '../../assets/images/backbutton.svg';
import { addVehicleAPI } from '../../services/VehicleAPI/Vehicle';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

type Props = {};

const AddVehicle: React.FC<Props> = () => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [insuranceValidity, setInsuranceValidity] = useState('');
  const [insuranceStatus, setInsuranceStatus] = useState('');
  const [registrationValidity, setRegistrationValidity] = useState('');
  const [insuranceAmount, setInsuranceAmount] = useState('');
  const [licenseAmount, setLicenseAmount] = useState('');
  const [licenseValidity, setLicenseValidity] = useState('');
  const [startingKilometer, setStartingKilometer] = useState('');
  const [expenses, setExpenses] = useState('');
  const [image, setImage] = useState<string | null>(null); // Accepts string or null
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {    
    const file = event.target.files?.[0];    
    if (file) {      
      const reader = new FileReader();       
      reader.onloadend = () => {        
        setImage(reader.result as string); // Cast to string
      }; 
      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('vehicleNo', vehicleNo);
    formData.append('insuranceValidity', insuranceValidity);
    formData.append('insuranceStatus', insuranceStatus);
    formData.append('registrationValidity', registrationValidity);
    formData.append('insuranceAmount', insuranceAmount);
    formData.append('licenseAmount', licenseAmount);
    formData.append('licenseValidity', licenseValidity);
    formData.append('startingKilometer', startingKilometer);
    formData.append('expenses', expenses);
    if (image) formData.append('image', image); // Add Base64 string to FormData if exists

    try {
      const response = await addVehicleAPI(formData);
      if (response.message) {
        toast.error(response.message);
      } else {
        toast.success('Vehicle added successfully');
        console.log('Vehicle added successfully:', response.data);

        // Reset form fields
        setVehicleNo('');
        setInsuranceValidity('');
        setInsuranceStatus('');
        setRegistrationValidity('');
        setInsuranceAmount('');
        setLicenseAmount('');
        setLicenseValidity('');
        setStartingKilometer('');
        setExpenses('');
        setImage(null); // Reset to null

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
      console.error('Error adding vehicle:', error);
    }
  };

console.log(error)
  console.log(success);
  

  return (
    <div className='p-1'>

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
      <div className="flex gap-3 items-center w-full max-w-8xl mb-3 ms-1">
        <Link to={'/vehicle'}>
          <div className="icon-placeholder">
            <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Create New Vehicle</h2>
      </div>

      <div className="w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        {/* <h2 className="text-[20px] text-[#303F58] font-semibold mb-6">Add vehicle</h2> */}
        <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-5 space-y-1">


          {/* Vehicle Number */}
          <div>
  <label className="block text-[#303F58] font-[14px] mb-2">
    Vehicle Number <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
     placeholder="Enter Vehicle Number (e.g., KL07AB1234)"
    value={vehicleNo}
    onChange={(e) => {
      const inputValue = e.target.value.toUpperCase(); // Convert to uppercase
      
      // Remove any spaces and only allow alphanumeric characters
      const formattedValue = inputValue.replace(/[^A-Z0-9]/g, '');

      setVehicleNo(formattedValue); // Update state with the formatted value
    }}
    className={`w-full px-3 py-2 border rounded-md 
                ${vehicleNo && !/^[A-Z0-9]+$/.test(vehicleNo) ? 'border-red-500' : 'border-gray-300'} 
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
    required
  />
  <p className="text-red-500 mt-1">
    {vehicleNo && !/^[A-Z0-9]+$/.test(vehicleNo) && "Only uppercase letters and numbers are allowed"}
  </p>
</div>


          {/* Uploaded Vehicle Image */}
          <div className="flex">
            <label className="mt-4 border text-[#8F99A9] text-base font-[14px] rounded-lg cursor-pointer">
              <div className="w-[80px] h-[80px] bg-[#F7E7CE] rounded-lg overflow-hidden">
                <img
                  src={image? image : upload}
                  alt=""
                  className="object-cover w-20 h-20 rounded-md"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <h2 className="font-bold mt-10 ms-3 text-[#303F58]">
              Upload Item Image
            </h2>
          </div>


{/* <div className="flex">
<div>
      <input type="file" onChange={handleImageUpload} />
      
      {image && (
        <div>
          <p>Uploaded Image:</p>
          <img src={image} alt="Uploaded" style={{ width: "200px" }} />
        </div>
      )}
    </div>
    </div> */}

    
          {/* Insurance Status */}
          <div>
  <label className="block text-[#303F58] font-[14px] mb-2">Insurance Status <span className="text-red-500">*</span></label>
  <select
    value={insuranceStatus}
    onChange={(e) => setInsuranceStatus(e.target.value)}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="" disabled>Select Insurance Status</option> {/* Placeholder option */}
    <option value="Valid">Valid</option>
    <option value="Expired">Expired</option>
  </select>
</div>

          {/* Registration Validity */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Registration Validity</label>
            <input
              type="date"
              value={registrationValidity}
              onChange={(e) => setRegistrationValidity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
          {/* Insurance Validity */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Insurance Validity</label>
            <input
              type="date"
              value={insuranceValidity}
              onChange={(e) => setInsuranceValidity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
          {/* Starting Kilometer */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Starting Kilometer <span className="text-red-500">*</span></label>
            <input
              type="number"
              placeholder="Enter Starting Kilometers"
              value={startingKilometer}
              onChange={(e) => setStartingKilometer(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Insurance Amount */}
          <div>
            <label className="block text-[#303F58] font-[14px]">Insurance Amount</label>
            <input
              type="number"
              placeholder="Enter Insurance Amount"
              value={insuranceAmount}
              onChange={(e) => setInsuranceAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
          {/* Expenses */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Expenses</label>
            <input
              type="number"
              placeholder="Enter Expenses"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
          {/* License Amount */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">License Amount</label>
            <input
              type="number"
              placeholder="Enter License Amount"
              value={licenseAmount}
              onChange={(e) => setLicenseAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
          {/* License Validity */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">License Validity</label>
            <input
              type="date"
              value={licenseValidity}
              onChange={(e) => setLicenseValidity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
          {/* Buttons */}
          <div className="col-span-2 flex justify-end">
            <button
              className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]"
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;