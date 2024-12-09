import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import backbutton from "../assets/images/nav-item.png";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";

interface FormData {
  customerType: "Business" | "Individual";
  companyName: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city:string;
  street:string;
  zipPostalCode:string;
  flatNumber:string;
  email: string;
  numberOfBottles: string;
  ratePerBottle: string;
  paymentMode: "Cash" | "Credit" | "Coupon";
  mobileNo: string;
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
  mainRouteId: string;
  mainRouteName: string;
  subRouteName: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    customerType: "Individual",
    companyName: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    street: "",
    zipPostalCode: "",
    flatNumber: "",
    email: "",
    numberOfBottles: "",
    ratePerBottle: "",
    paymentMode: "Cash",
    mobileNo: "",
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
  const [mainRouteList, setMainRouteList] = useState<string[]>([]);
  const [isLocationSaved, setIsLocationSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { request: addCustomer } = useApi("post", 4000);
  const { request: getSubRoute } = useApi("get", 4000);

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
    const mainRouteName = event.target.value;
    setSelectedMainRoute(mainRouteName);

    // Filter subroutes based on the selected main route
    const filtered = routesList.filter(
      (route) => route.mainRouteName === mainRouteName
    );

    setFilteredSubRoutes(filtered);

    // Reset the selected subroute when the main route changes
    setSelectedSubRoute("");
  };

  const handleSubRouteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Update the selected subroute state
    setSelectedSubRoute(event.target.value);
  };

  useEffect(() => {
    // Fetch the routes list
    const fetchSubRoutes = async () => {
      try {
        const url = `${endpoints.GET_ALL_SUBROUTE}`;
        const { response, error } = await getSubRoute(url);

        if (error) {
          console.error("Error fetching sub-route data:", error);
          toast.error("Failed to fetch route data. Please try again.");
          return;
        }

        const routes = Array.isArray(response) ? response : response?.data;

        if (routes && Array.isArray(routes)) {
          // Set the routes list for filtering
          setRouteList(routes);

          // Extract unique main routes
          const uniqueMainRoutes = Array.from(
            new Set(routes.map((route: Route) => route.mainRouteName))
          );
          setMainRouteList(uniqueMainRoutes as string[]);
        }
      } catch (err) {
        console.error("Error fetching sub-route data:", err);
        toast.error("An unexpected error occurred. Please try again.");
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
      setIsLocationSaved(false);
      toast.info("Location cleared.");
    } else {
      try {
        setIsGettingLocation(true);
        const coords = await getCurrentLocation();
        setFormData((prevData) => ({
          ...prevData,
          location: {
            address: "",
            coordinates: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          },
        }));
        setIsLocationSaved(true);
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
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (
      isNaN(Number(formData.numberOfBottles)) ||
      Number(formData.numberOfBottles) <= 0
    ) {
      newErrors.numberOfBottles = "Number of bottles must be a positive number";
    }
    if (
      isNaN(Number(formData.ratePerBottle)) ||
      Number(formData.ratePerBottle) <= 0
    ) {
      newErrors.ratePerBottle = "Rate must be a positive number";
    }
    if (formData.mobileNo.length < 10)
      newErrors.mobileNo = "Mobile number must be at least 10 digits";
    if (formData.whatsappNumber.length < 10)
      newErrors.whatsappNumber = "WhatsApp number must be at least 10 digits";
    if (
      isNaN(Number(formData.depositAmount)) ||
      Number(formData.depositAmount) < 0
    ) {
      newErrors.depositAmount = "Deposit amount must be a non-negative number";
    }
    if (!selectedMainRoute) newErrors.mainRoute = "Main route is required";
    if (!selectedSubRoute) newErrors.subRoute = "Sub route is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log(loading);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Step 1: Validate the form
    const isValid = validateForm(); // Ensure you have the validateForm function implemented
    if (!isValid) {
      toast.error("Please fix the form errors.");
      return; // Stop the submission if validation fails
    }

    setLoading(true); // Show loading spinner or message

    try {
      // Step 2: Prepare the payload
      const payload = {
        ...formData,
        mainRoute: selectedMainRoute, // Ensure you're adding the selected main route
        subRoute: selectedSubRoute, // And the selected subroute
      };
      console.log("Payload:", payload);

      // Step 3: Call the API to add the customer
      const url = `${endpoints.ADD_CUSTOMER}`;
      const { response, error } = await addCustomer(url, payload); // Assuming addCustomer is correctly hooked up
      console.log(response);

      if (error) {
        // Step 4: Handle API errors
        toast.error(
          error.message || "Failed to add customer. Please try again."
        );
      } else {
        // Step 5: Success - Show success message and navigate
        toast.success("Customer added successfully.");
        setTimeout(() => {
          navigate("/viewcustomers"); // Navigate after success
        }, 2000);
      }
    } catch (err) {
      // Handle unexpected errors
      console.error("Error adding customer:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
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
          <Link to="/viewcustomers">
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
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Full Name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter email"
            />

          </div>
          <div>
            <label className="block text-gray-700">AddressLine 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter address 1"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700">AddressLine 2</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter address 2"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter city"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter street"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700">Zip Postal Code</label>
            <input
              type="number"
              name="zipPostalCode"
              value={formData.zipPostalCode}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter zipcode"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700">Flat Number</label>
            <input
              type="text"
              name="flatNumber"
              value={formData.flatNumber}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter zipcode"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Number Of Bottles</label>
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
              <label className="block text-gray-700">Rate Per Bottle</label>
              <input
                type="text"
                name="ratePerBottle"
                value={formData.ratePerBottle}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Rate per bottle"
              />
              {errors.ratePerBottle && (
                <p className="text-red-500 text-sm">{errors.ratePerBottle}</p>
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
              <option value="Coupon">Coupon</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Mobile Number"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">WhatsApp Number</label>
            <input
              type="text"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter WhatsApp Number"
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
              {mainRouteList.map((mainRouteName) => (
                <option key={mainRouteName} value={mainRouteName}>
                  {mainRouteName}
                </option>
              ))}
            </select>
            {errors.mainRouteName && (
              <p className="text-red-500 text-sm">{errors.mainRouteName}</p>
            )}
          </div>

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
              disabled={!selectedMainRoute}
            >
              <option value="">Select Sub Route</option>
              {filteredSubRoutes.map((route) => (
                <option key={route._id} value={route.subRouteName}>
                  {route.subRouteName}
                </option>
              ))}
            </select>
            {errors.subRoute && (
              <p className="text-red-500 text-sm">{errors.subRouteName}</p>
            )}
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
}
