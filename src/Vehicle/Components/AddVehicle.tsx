import React, { ChangeEvent, useEffect, useState } from 'react';
import upload from '../../assets/images/upload image.svg'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import BackIcon from '../../assets/icons/BackIcon';
import Button from '../../commoncomponents/Buttons/Button';
import useApi from '../../Hook/UseApi';
import { endpoints } from '../../services/ApiEndpoint';

type Props = {};

interface VehicleData {
  vehicleNo: string;
  insuranceValidity: string;
  insuranceStatus: string;
  registrationValidity: string;
  insuranceAmount: number;
  licenseAmount: number;
  licenseValidity: string;
  startingKilometer: number;
  expenses: number;
  image: string;

}
const AddVehicle: React.FC<Props> = () => {
  const [initialVehicleData, SetInitialVehicleData] = useState<VehicleData>(
    {
      expenses: 0,
      image: "",
      insuranceAmount: 0,
      insuranceStatus: "",
      insuranceValidity: "",
      licenseAmount: 0,
      licenseValidity: "",
      registrationValidity: "",
      startingKilometer: 0,
      vehicleNo: "",
    }
  );
  console.log(initialVehicleData);
  const { id } = useParams();
  const isEditing = Boolean(id);
  console.log(id, "id");

  const navigate = useNavigate()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        SetInitialVehicleData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };
  const { request: getVehicle } = useApi("get", 4000);

  // Fetch  data for editing
  const getAnVehicle = async () => {
    const url = `${endpoints.VIEW_AN_VEHICLE}/${id}`;
    try {
      const { response, error } = await getVehicle(url);
      if (!error && response) {
        SetInitialVehicleData({
          ...initialVehicleData,
          ...response.data.vehicle,
          insuranceValidity: response.data.vehicle.insuranceValidity?.slice(0, 10) || "",
          licenseValidity: response.data.vehicle.licenseValidity?.slice(0, 10) || "",
          registrationValidity: response.data.vehicle.registrationValidity?.slice(0, 10) || "",
        });
      }
      console.log(response?.data.vehicle, "An Vehicle Data");
    } catch (error) {
      console.error("Unexpected error fetching vehicle data:", error);
    }
  };

  // Initialize data if editing
  useEffect(() => {
    if (isEditing && id) {
      getAnVehicle();
    }
  }, [isEditing, id]);


  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "insuranceStatus") {
      // Reset insuranceValidity and error message when insurance status changes
      SetInitialVehicleData((prevData) => ({
        ...prevData,
        insuranceStatus: value,
        insuranceValidity: "", // Reset date field
      }));
    } else if (name === "insuranceValidity") {
      validateInsuranceValidity(value);
    } else {
      SetInitialVehicleData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Function to validate insurance validity date
  const validateInsuranceValidity = (selectedDate: string) => {
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
    const selectedDateObj = new Date(selectedDate);
    const todayDateObj = new Date(today);

    let error = "";

    if (initialVehicleData.insuranceStatus === "Valid") {
      if (selectedDateObj <= todayDateObj) {
        error = "For 'Valid' insurance, choose a future date.";
      }
    } else if (initialVehicleData.insuranceStatus === "Expired") {
      if (selectedDateObj >= todayDateObj) {
        error = "For 'Expired' insurance, choose a past date.";
      }
    }

    if (!error) {
      // Update state only if there's no error
      SetInitialVehicleData((prevData) => ({
        ...prevData,
        insuranceValidity: selectedDate,
      }));
    }
  };
  const { request: editVehicle } = useApi("put", 4000);
  const { request: addVehicle } = useApi("post", 4000);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isEditing
      ? `${endpoints.EDIT_VEHICLE}/${id}`
      : `${endpoints.ADD_VEHICLE}`;

    try {
      const { response, error } = isEditing
        ? await editVehicle(url, initialVehicleData)
        : await addVehicle(url, initialVehicleData);

      if (!error && response) {
        toast.success(
          isEditing
            ? "Vehicle edited successfully!"
            : "Vehicle added successfully!"
        );
        console.log(response);

        if (!isEditing) {
          SetInitialVehicleData(initialVehicleData); // Reset form
        }

        if (isEditing) {
          setTimeout(() => {
            navigate("/vehicle"); // Navigate after 2 seconds
          }, 2000);
        }
      } else {
        toast.error("Failed to save vehicle data.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error submitting vehicle data:", error);
    }
  };

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
          <BackIcon />
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold"> {isEditing ? "Edit Vehicle" : "Create New Vehicle"}</h2>
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
              value={initialVehicleData.vehicleNo}
              name="vehicleNo"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Uploaded Vehicle Image */}
          <div className="">
            <div className="rounded-lg items-center  flex text-center">
              <label htmlFor="image">
                <div className="flex">
                  <div
                    className={`bg-[#F7E7CE] flex items-center justify-center h-16 w-24 rounded-lg 
                      `}
                  >
                    {initialVehicleData.image ? (
                      <img
                        src={initialVehicleData.image}
                        alt="Item"
                        className="max-h-16 max-w-20"
                      />
                    ) : (
                      <img
                        src={upload}
                        alt=""
                        className="object-cover cursor-pointer rounded-md "
                      />
                    )}
                  </div>
                  <div className=" mt-2 ms-5">
                    <div className="text-[#565148] cursor-pointer border border-[#565148] text-[12px] w-40 rounded-lg px-3 py-1.5 h-8 " >
                      Upload Vehicle Image
                    </div>
                    <p className="text-[#4B5C79] text-[12px] pt-1">At least 800 x 800 px Recommended. JPG or PNG is Allowed</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          {/* Insurance Status */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-2">Insurance Status <span className="text-red-500">*</span></label>
            <select
              value={initialVehicleData.insuranceStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name='insuranceStatus'
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
              value={initialVehicleData.registrationValidity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name='registrationValidity'
            />
          </div>
          {/* Insurance Validity */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Insurance Validity</label>
            <input
              type="date"
              value={initialVehicleData.insuranceValidity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              name="insuranceValidity"
              min={initialVehicleData.insuranceStatus === "Valid" ? new Date().toISOString().split("T")[0] : ""}
              max={initialVehicleData.insuranceStatus === "Expired" ? new Date().toISOString().split("T")[0] : ""}
            />
          </div>
          {/* Starting Kilometer */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Starting Kilometer <span className="text-red-500">*</span></label>
            <input
              type="number"
              placeholder="Enter Starting Kilometers"
              value={initialVehicleData.startingKilometer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              name='startingKilometer'
            />
          </div>
          {/* Insurance Amount */}
          <div>
            <label className="block text-[#303F58] font-[14px]">Insurance Amount</label>
            <input
              type="number"
              placeholder="Enter Insurance Amount"
              value={initialVehicleData.insuranceAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name='insuranceAmount'
            />
          </div>
          {/* Expenses */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">Expenses</label>
            <input
              type="number"
              placeholder="Enter Expenses"
              value={initialVehicleData.expenses}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name='expenses'
            />
          </div>
          {/* License Amount */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">License Amount</label>
            <input
              type="number"
              placeholder="Enter License Amount"
              value={initialVehicleData.licenseAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name='licenseAmount'
            />
          </div>
          {/* License Validity */}
          <div>
            <label className="block text-[#303F58] font-[14px] mb-1">License Validity</label>
            <input
              type="date"
              value={initialVehicleData.licenseValidity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name='licenseValidity'
            />
          </div>
          {/* Buttons */}
          <div className="col-span-2 gap-2 flex justify-end pt-2">
            <Link to={"/vehicle"}>
              <Button variant='fourthiary'>
                Cancel
              </Button>
            </Link>
            <Button type='submit' variant='primary'>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;