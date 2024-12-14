import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backbutton from "../assets/images/nav-item.png";
import { Link, useParams, useNavigate } from "react-router-dom";
// import { getSubRoutesAPI } from "../services/StartRide/StartRide";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";

interface Route {
  _id: string;
  subRoute: string;
  mainRouteId: string;
  mainRouteName: string;
  subRouteName: string;
}

interface Location {
  address: string;
  coordinates: {
    type: string;
    coordinates: [number, number] | []; // Allow either a valid tuple or an empty array
  };
}



interface CustomerData {
  _id: string;
  customerType: string;
  companyName:string;
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  numberOfBottles: number;
  ratePerBottle: number;
  paymentMode: string;
  mobileNo: string;
  whatsappNumber: string;
  depositAmount: number;
  mainRoute: string;
  subRoute: string;
  location: Location;
}

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [routesList, setRouteList] = useState<Route[]>([]);
  const [mainRouteList, setMainRouteList] = useState<string[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [loading,setLoading] = useState(false)


  const { request: getSubRoute } = useApi("get", 4000);
  const { request: getACustomer } = useApi("get", 4000)
  const { request: updateCustomer } = useApi("put", 4000)



  // useEffect(() => {
  //   const fetchSubRoutes = async () => {
  //     try {
  //       const response: Route[] = await getSubRoutesAPI();
  //       setRouteList(response);

  //       const uniqueMainRoutes: string[] = Array.from(
  //         new Set(response.map((route: Route) => route.mainRoute))
  //       );

  //       setMainRouteList(uniqueMainRoutes);
  //     } catch (error) {
  //       console.error("Error fetching sub-route data:", error);
  //       toast.error("Failed to fetch routes");
  //     }
  //   };

  //   fetchSubRoutes();
  // }, []);

  // useEffect(() => {
  //   // Fetch the routes list
  //   const fetchSubRoutes = async () => {
  //     try {
  //       const url = `${endpoints.GET_ALL_SUBROUTE}`;
  //       const { response, error } = await getSubRoute(url);

  //       if (error) {
  //         console.error("Error fetching sub-route data:", error);
  //         toast.error("Failed to fetch route data. Please try again.");
  //         return;
  //       }

  //       const routes = Array.isArray(response) ? response : response?.data;

  //       if (routes && Array.isArray(routes)) {
  //         // Set the routes list for filtering
  //         setRouteList(routes);

  //         // Extract unique main routes
  //         const uniqueMainRoutes = Array.from(
  //           new Set(routes.map((route: Route) => route.mainRouteName))
  //         );
  //         setMainRouteList(uniqueMainRoutes as string[]);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching sub-route data:", err);
  //       toast.error("An unexpected error occurred. Please try again.");
  //     }
  //   };

  //   fetchSubRoutes();
  // }, []);

    // Fetch routes and prepare dropdown lists
    useEffect(() => {
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

  // useEffect(() => {
  //   const fetchCustomerData = async () => {
  //     if (id) {
  //       try {
  //         const response = await getACustomerAPI(id); 
  //         setCustomerData(response as any); 
  //       } catch (error) {
  //         console.error("Error fetching customer data:", error);
  //         toast.error("Failed to fetch customer data");
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchCustomerData();
  // }, [id]);





  const getOneCustomer = async () => {
    try {
      const url = `${endpoints.GET_A_CUSTOMER}/${id}`
      const { response, error } = await getACustomer(url)
      console.log(response)

      if (!error && response) {
        setLoading(false)
        console.log(loading);
        
        setCustomerData(response.data)
        console.log(customerData);
        
        // setSortedItems(response.data); // Initialize sorted items
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOneCustomer()
  }, [])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setCustomerData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      console.log(getCurrentLocation);
      

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });
  };

  const handleLocationFetch = () => {
    if (!customerData) return; // Ensure customerData is not null
  
    if (
      customerData.location?.coordinates?.coordinates &&
      customerData.location.coordinates.coordinates.length === 2
    ) {
      // Clear Location
      setCustomerData((prev) => {
        if (!prev) return prev; // Safeguard against null
        return {
          ...prev,
          location: {
            ...prev.location,
            coordinates: { type: "Point", coordinates: [] },
          },
        };
      });
    } else {
      // Save Location
      setIsGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCustomerData((prev) => {
            if (!prev) return prev; // Safeguard against null
            return {
              ...prev,
              location: {
                ...prev.location,
                coordinates: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
              },
            };
          });
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };
  


  

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  
  //   if (!customerData) {
  //     toast.error("No customer data to update");
  //     return;
  //   }
  
  //   try {
  //     const cleanedCustomerData: CustomerData = {
  //       ...customerData,
  //       numberOfBottles: Number(customerData.numberOfBottles),
  //       ratePerBottle: Number(customerData.ratePerBottle),
  //       depositAmount: Number(customerData.depositAmount),
  //       location: {
  //         address: customerData.location?.address || "",
  //         coordinates: {
  //           latitude: customerData.location?.coordinates?.latitude ?? null,
  //           longitude: customerData.location?.coordinates?.longitude ?? null,
  //         },
  //       },
  //     };
  
  //     // Create a new FormData object
  //     const formData = new FormData();
  //     Object.keys(cleanedCustomerData).forEach((key) => {
  //       const value = cleanedCustomerData[key as keyof CustomerData];
  //       // Flatten location data and append
  //       if (key === "location") {
  //         const locationData = value as Location;
  //         formData.append("location[address]", locationData.address);
  //         formData.append("location[latitude]", locationData.coordinates.latitude?.toString() || "");
  //         formData.append("location[longitude]", locationData.coordinates.longitude?.toString() || "");
  //       } else if (value !== null && value !== undefined) {
  //         formData.append(key, value as any);
  //       }
  //     });
  
  //     // Log FormData to check the contents before sending
  //     for (let [key, value] of formData.entries()) {
  //       console.log(`${key}: ${value}`);
  //     }
  
  //     // Send FormData to the API
  //     const response = await updateCustomerAPI(customerData._id, formData);
  //     console.log("Update response:", response);
  
  //     toast.success("Customer updated successfully");
  //     setTimeout(() => {
  //       navigate("/viewcustomers");
  //     }, 2000);
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "An error occurred while updating the customer"
  //     );
  //     console.error("Error updating customer:", error);
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!customerData) {
      toast.error("No customer data to update");
      return;
    }
  
    try {
      // Prepare the cleaned customer data
      const cleanedCustomerData: CustomerData = {
        ...customerData,
        numberOfBottles: Number(customerData.numberOfBottles),
        ratePerBottle: Number(customerData.ratePerBottle),
        depositAmount: Number(customerData.depositAmount),
        location: {
          address: customerData.location?.address || "",
          coordinates: {
            type: "Point",
            coordinates:
              customerData.location?.coordinates?.coordinates.length === 2
                ? customerData.location.coordinates.coordinates
                : [0, 0], // Default to [0, 0] if coordinates are empty
          },
        },
      };
  
      // Create FormData object
      const formData = new FormData();
      Object.keys(cleanedCustomerData).forEach((key) => {
        const value = cleanedCustomerData[key as keyof CustomerData];
        if (key === "location") {
          // Flatten location data
          const locationData = value as Location;
          formData.append("location[address]", locationData.address);
          if (locationData.coordinates.coordinates.length === 2) {
            formData.append("location[longitude]", locationData.coordinates.coordinates[0].toString());
            formData.append("location[latitude]", locationData.coordinates.coordinates[1].toString());
          } else {
            formData.append("location[longitude]", "");
            formData.append("location[latitude]", "");
          }
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      });
  
      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      // Send API request using the useApi hook
      const { response, error } = await updateCustomer(
        `${endpoints.UPDATE_CUSTOMER}/${id}`,
        formData
      );
  
      if (error) {
        console.error("Error updating customer:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update");
        return;
      }
  
      console.log("Update response:", response);
      toast.success("Customer updated successfully");
  
      // Navigate after a delay
      setTimeout(() => {
        navigate("/viewcustomers");
      }, 2000);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the customer"
      );
    }
  };
  
  
  

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (!customerData) {
    return <div>No customer data available.</div>;
  }

  return (
    <div className="m-3 bg-[#F5F6FA]">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="p-6 bg-[#FFFFFF] shadow-md rounded-lg">
        <Link to="/viewcustomers">
          <button className="w-[40px] h-[40px] rounded-full p-1 flex items-center justify-center">
            <img src={backbutton} alt="Back" className="w-full h-full" />
          </button>
        </Link>
        <h2 className="text-lg font-semibold text-center">Edit Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Type */}
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
                  checked={customerData.customerType === "Individual"}
                  onChange={handleInputChange}
                />
                Individual
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="customerType"
                  value="Business"
                  checked={customerData.customerType === "Business"}
                  onChange={handleInputChange}
                />
                Business
              </label>
            </div>
          </div>

          {/* Company Name (for Business customers) */}
          {customerData.customerType === "Business" && (
            <div>
              <label className="block text-[#303F58] font-[14px] mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={customerData.companyName}
                onChange={handleInputChange}
                className="w-full h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Company Name"
              />
            </div>
          )}

          {/* First Name */}
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={customerData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter First Name"
            />
          </div>

          {/* Last Name */}
          {/* <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={customerData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Last Name"
            />
          </div> */}

          {/* Email */}
          {/* <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={customerData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Email"
            />
          </div> */}

          <div>
            <label className="block text-gray-700">addressLine 1</label>
            <input
              type="text"
              name="addressLine1"
              value={customerData.addressLine1}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter address 1"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>
          <div>
            <label className="block text-gray-700">addressLine 2</label>
            <input
              type="text"
              name="addressLine2"
              value={customerData.addressLine2}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter address 2"
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )} */}
          </div>

          {/* Number of Bottles and Rate */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Number of Bottles</label>
              <input
                type="number"
                name="noOfBottles"
                value={customerData.numberOfBottles}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Number of Bottles"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Rate per Bottle</label>
              <input
                type="number"
                name="ratePerBottle"
                value={customerData.ratePerBottle}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Rate per Bottle"
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-gray-700">Payment Mode</label>
            <select
              name="paymentMode"
              value={customerData.paymentMode}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
            >
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="mobileNo"
              value={customerData.mobileNo}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Contact Number"
            />
          </div>

          {/* Whatsapp Number */}
          <div>
            <label className="block text-gray-700">Whatsapp Number</label>
            <input
              type="text"
              name="whatsappNumber"
              value={customerData.whatsappNumber}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Enter Whatsapp Number"
            />
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-gray-700">Deposit Amount</label>
            <input
              type="number"
              name="depositAmount"
              value={customerData.depositAmount}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Deposit Amount"
            />
          </div>

{/* Main Route */}
<div className="space-y-1">
        <label
          htmlFor="main-route"
          className="text-sm font-medium text-gray-700"
        >
          Main Route
        </label>
        <select
          id="main-route"
          name="mainRoute"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={customerData.mainRoute}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Main Route</option>
          {mainRouteList.map((mainRoute) => (
            <option key={mainRoute} value={mainRoute}>
              {mainRoute}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Route */}
      <div className="space-y-1">
        <label
          htmlFor="sub-route"
          className="text-sm font-medium text-gray-700"
        >
          Sub Route
        </label>
        <select
          id="sub-route"
          name="subRoute"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={customerData.subRoute}
          onChange={handleInputChange}
          disabled={!customerData.mainRoute}
          required
        >
          <option value="">Select Sub Route</option>
          {routesList
            .filter((route) => route.mainRouteName === customerData.mainRoute)
            .map((route) => (
              <option key={route._id} value={route.subRouteName}>
                {route.subRouteName}
              </option>
            ))}
        </select>
      </div>


          {/* Location Map */}
          {customerData.location?.coordinates?.coordinates && (
  <iframe
    src={`https://www.google.com/maps?q=${customerData.location.coordinates.coordinates[1]},${customerData.location.coordinates.coordinates[0]}&z=15&output=embed`}
    width="100%"
    height="300"
    className="mt-4 border rounded-md"
  ></iframe>
)}

          {/* Location Fetch Button */}
          <button
  type="button"
  onClick={handleLocationFetch}
  disabled={isGettingLocation}
  className={`w-full bg-[#820000] text-white p-2 mt-4 rounded-md ${
    isGettingLocation ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {isGettingLocation
    ? "Fetching Location..."
    : customerData.location?.coordinates?.coordinates &&
      customerData.location.coordinates.coordinates.length === 2
    ? "Clear Location"
    : "Save Location"}
</button>


          {/* Submit Button */}
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

export default EditCustomer;
