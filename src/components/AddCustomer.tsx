import React, { useEffect, useState } from "react";
import { addCustomerAPI } from "../services/customer/customerAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSubRoutesAPI } from "../services/StartRide/StartRide";
import { Link } from "react-router-dom";
import backbutton from "../assets/images/nav-item.png";

interface FormData {
  customerType: "Business" | "Individual";
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfBottles: string;
  rate: string;
  paymentMode: "Cash" | "Credit";
  contactNumber: string;
  whatsappNumber: string;
  depositAmount: string;
  subRoute: string;
  mainRoute: string;
  location: {
    address: string;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
}

interface Route {
  _id: string;
  subRoute: string;
  mainRoute: string;
}

interface FormErrors {
  [key: string]: string;
}

const AddCustomer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    customerType: "Individual",
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    numberOfBottles: "",
    rate: "",
    paymentMode: "Cash",
    contactNumber: "",
    whatsappNumber: "",
    depositAmount: "",
    mainRoute: "",
    subRoute: "",
    location: {
      address: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedMainRoute, setSelectedMainRoute] = useState<string>("");
  const [selectedSubRoute, setSelectedSubRoute] = useState<string>("");
  const [filteredSubRoutes, setFilteredSubRoutes] = useState<Route[]>([]);
  const [routesList, setRouteList] = useState<Route[]>([]);
  const [mainRouteList, setMainRouteList] = useState<any[]>([]);
  const [isLocationSaved, setIsLocationSaved] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "location") {
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          address: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleMainRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const mainRoute = event.target.value;
    setSelectedMainRoute(mainRoute);
    setFilteredSubRoutes(
      routesList.filter((route) => route.mainRoute === mainRoute)
    );
    setSelectedSubRoute(""); // Reset sub-route selection
  };

  const handleSubRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSubRoute(event.target.value);
  };

  useEffect(() => {
    const fetchSubRoutes = async () => {
      try {
        const response = await getSubRoutesAPI();
        setRouteList(response);

        const uniqueMainRoutes = Array.from(
          new Set(response.map((route: Route) => route.mainRoute))
        );
        setMainRouteList(uniqueMainRoutes);
      } catch (error) {
        console.error("Error fetching sub-route data:", error);
      }
    };

    fetchSubRoutes();
  }, []);

  const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });
  };
  const handleLocationFetch = async () => {
    if (isLocationSaved) {
      // Clear location if already saved
      setFormData((prevData) => ({
        ...prevData,
        location: {
          address: "",
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },
      }));
      setIsLocationSaved(false); // Mark location as unsaved
      toast.info("Location cleared.");
    } else {
      // Fetch location if not saved
      try {
        setIsGettingLocation(true);
        const coords = await getCurrentLocation();
        setFormData((prevData) => ({
          ...prevData,
          location: {
            address: "", // Set address if needed
            coordinates: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          },
        }));
        setIsLocationSaved(true); // Mark location as saved
        toast.success("Location fetched successfully");
      } catch (error) {
        console.error("Error fetching location:", error);
        toast.error("Error fetching location. Please try again.");
      } finally {
        setIsGettingLocation(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.customerType === "Business" && !formData.companyName) {
      newErrors.companyName = "Company name is required for business customers";
    }
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (
      isNaN(Number(formData.numberOfBottles)) ||
      Number(formData.numberOfBottles) <= 0
    ) {
      newErrors.numberOfBottles = "Number of bottles must be a positive number";
    }
    if (isNaN(Number(formData.rate)) || Number(formData.rate) <= 0) {
      newErrors.rate = "Rate must be a positive number";
    }
    if (formData.contactNumber.length < 10)
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    if (formData.whatsappNumber.length < 10)
      newErrors.whatsappNumber = "WhatsApp number must be at least 10 digits";
    if (
      isNaN(Number(formData.depositAmount)) ||
      Number(formData.depositAmount) < 0
    ) {
      newErrors.depositAmount = "Deposit amount must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const updatedFormData = {
          ...formData,
          mainRoute: selectedMainRoute,
          subRoute: selectedSubRoute,
        };

        if (isLocationSaved) {
          // Include location only if saved
          updatedFormData.location = formData.location;
        }

        const response = await addCustomerAPI(updatedFormData);
        if (response?.status === 201) {
          toast.success("Customer added successfully");
        } else {
          toast.error("Something went wrong");
        }

        setErrors({});
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error: Unable to submit form. Please try again.");
      }
    }
  };

  return (
    <div className="m-3 bg-[#F5F6FA]">
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

      <div className="p-6 bg-[#FFFFFF] shadow-md rounded-lg">
        <div className="flex items-center mb-4">
          <Link to={"/viewcustomers"}>
            <button className="w-[40px] h-[40px] rounded-full p-1 flex items-center justify-center">
              <img src={backbutton} alt="Back" className="w-full h-full" />
            </button>
          </Link>
          <h2 className="text-lg font-semibold text-center flex-1">
            New Customer
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-3 mb-3">
              Customer Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="customerType"
                  value="Individual"
                  checked={formData.customerType === "Individual"}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                Individual
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="customerType"
                  value="Business"
                  checked={formData.customerType === "Business"}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                Business
              </label>
            </div>
          </div>

          {formData.customerType === "Business" && (
            <div>
              <label className="block text-[#303F58] font-[14px] mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Company Name"
                required
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Number of Bottles</label>
              <input
                type="text"
                name="numberOfBottles"
                value={formData.numberOfBottles}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Number of Bottles"
              />
              {errors.numberOfBottles && (
                <p className="text-red-500 text-sm">{errors.numberOfBottles}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Rate</label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Rate"
              />
              {errors.rate && (
                <p className="text-red-500 text-sm">{errors.rate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Payment Mode</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
            >
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
            </select>
            {errors.paymentMode && (
              <p className="text-red-500 text-sm">{errors.paymentMode}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Contact Number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Whatsapp Number</label>
            <input
              type="text"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Whatsapp Number"
            />
            {errors.whatsappNumber && (
              <p className="text-red-500 text-sm">{errors.whatsappNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Deposit Amount</label>
            <input
              type="text"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Deposit Amount"
            />
            {errors.depositAmount && (
              <p className="text-red-500 text-sm">{errors.depositAmount}</p>
            )}
          </div>

          {/* Main Route Selection */}
          <div className="space-y-1">
            <label
              htmlFor="main-route"
              className="text-sm font-medium text-gray-700"
            >
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

          {/* Sub Route Selection */}
          <div className="space-y-1">
            <label
              htmlFor="sub-route"
              className="text-sm font-medium text-gray-700"
            >
              Sub Route
            </label>
            <select
              id="sub-route"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedSubRoute}
              onChange={handleSubRouteChange}
              disabled={!selectedMainRoute} // Disable if no main route selected
            >
              <option value="">Select Sub Route</option>
              {filteredSubRoutes.map((route) => (
                <option key={route._id} value={route.subRoute}>
                  {route.subRoute}
                </option>
              ))}
            </select>
          </div>

          {isLocationSaved &&
            formData.location.coordinates.latitude &&
            formData.location.coordinates.longitude && (
              <iframe
                src={`https://www.google.com/maps?q=${formData.location.coordinates.latitude},${formData.location.coordinates.longitude}&z=15&output=embed`}
                width="100%"
                height="300"
                className="mt-4 border rounded-md"
              ></iframe>
            )}

          <button
            type="button"
            onClick={handleLocationFetch}
            disabled={isGettingLocation}
            className={`w-full bg-[#820000] text-white p-2 mt-4 rounded-md ${
              isGettingLocation ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLocationSaved
              ? "Clear Location"
              : isGettingLocation
              ? "Fetching Location..."
              : "Save Location"}
          </button>

          <button
            type="submit"
            className="w-full bg-[#820000] text-white p-2 mt-4 rounded-md"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
