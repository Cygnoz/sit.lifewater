import backbutton from "../assets/images/nav-item.png";
import user from '../assets/images/Icons/user-round-plus.svg'
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";
import Button from "../CommonComponents/Button";
import { toast, ToastContainer } from "react-toastify";

const Couponsale: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // const [activeSubRoute, setActiveSubRoute] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    couponId: "",
    paidAmount: "",
    customerId: "",
    depositAccountId: ""
  });
  console.log(formData);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch all coupons 
  const [coupons, setCoupons] = useState<any[]>([]);
  const { request: getCoupons } = useApi("get", 4000);
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const url = `${endpoints.GET_ALL_COUPON}`;
        const { response, error } = await getCoupons(url);
        if (!error && response) {
          // Update the state with the fetched coupon data
          setCoupons(response.data);
          console.log("coupons response", response.data);
        } else {
          console.error("Failed to fetch coupons:", error);
        }
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchCoupons();
    // fetchActiveRoute();
  }, []);

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCouponId = e.target.value;

    // Find the selected coupon object
    const selectedCoupon = coupons.find(coupon => coupon._id === selectedCouponId);

    setFormData({
      ...formData,
      couponId: selectedCouponId,
      paidAmount: selectedCoupon ? selectedCoupon.price : "" // Set price if found, else empty
    });
  };

  // Fetch activeroute with sales id
  // const { request: getActiveRoute } = useApi("get", 4000);
  // const SalesManId = localStorage.getItem("SalesManId");
  // const fetchActiveRoute = async () => {
  //   try {
  //     const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
  //     const { response, error } = await getActiveRoute(url);
  //     console.log("Active route with sales id:", response?.data?.activeRide);

  //     if (!error && response) {
  //       setLoading(false);
  //       const activeRide = response?.data?.activeRide;

  //       if (activeRide) {

  //         setActiveSubRoute(activeRide.subRouteName)
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   if (activeSubRoute) {
  //     getALLCustomersBySubRoute(activeSubRoute);
  //   };

  // }, [activeSubRoute]);

  // Get All customer in the subroute
  const { request: getAllCustomers } = useApi("get", 4000);
  // const getALLCustomersBySubRoute = async (subRoute: any) => {
  //   if (!subRoute) return; // Prevent API call if subRoute is undefined

  //   setLoading(true);
  //   try {
  //     const url = `${endpoints.GET_CUSTOMER_BY_SUBROUTE}/${subRoute}`;
  //     const { response, error } = await getAllCustomers(url);
  //     console.log("Get all customer in SubRoute", response);

  //     if (!error && response) {
  //       setCustomers(response?.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const getALLCustomers = async () => {
    setLoading(true);
    try {
      const url = `${endpoints.GET_ALL_COUPON_CUSTOMER}`;
      const { response, error } = await getAllCustomers(url);
      console.log("Get all coupon customers", response);

      if (!error && response) {
        setCustomers(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setFilteredCustomers(customers); // Reset if input is empty
      return;
    }
    const filtered = customers.filter((customer: any) => {
      return (
        customer?.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        customer?.customerID?.toLowerCase().includes(value.toLowerCase()) ||
        customer?.city?.toLowerCase().includes(value.toLowerCase()) ||
        customer?.mobileNo?.toString().includes(value) || // Convert number to string
        customer?.whatsappNumber?.toString().includes(value) // Convert number to string
      );
    });

    setFilteredCustomers(filtered);
  };

  const handleInputFocus = () => {
    // Show all customers when the input is focused
    setFilteredCustomers(customers);
  };

  const handleCustomerSelect = (customers: any) => {
    // Handle customer selection (e.g., update order data)
    setFormData((prevData) => ({
      ...prevData,
      customerId: customers?._id,
    }));
    //
    setSearchValue(customers.fullName); // Set the selected customer's name in the input
    setFilteredCustomers([]); // Clear the dropdown
  };
  // Fetch accounts from the API
  const { request: getallaccounts } = useApi("get", 4000);
  const fetchAccounts = async () => {
    try {
      const url = `${endpoints.GET_ALL_ACCOUNTS}`;
      const { response, error } = await getallaccounts(url);
      // console.log("API RESPONSE :", response);

      if (!error && response) {
        setLoading(false);

        const formattedData = response.data?.map((item: any) => item._doc);
        // console.log(loading);
        const filtered = formattedData?.filter(
          (account: any) => ["Cash", "Bank"].includes(account.accountSubhead)
        );
        setFilteredAccounts(filtered);
        console.log("filteredAccounts", filtered);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAccounts(),
      getALLCustomers()
  }, []);
  const handleDepositeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      depositAccountId: value,
    }));
  };

  const { request: AddCouponCustomer } = useApi("post", 4000);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${endpoints.ADD_COUPON_CUSTOMER}`;
    try {
      const { response, error } = await AddCouponCustomer(url, formData);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/couponcustomer"); // Navigate to couponcustomer page after 1 second
        }, 1000);
      } else {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error submitting order data:", error);
    }
  };

  return (
    <div className="max-h-screen">
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
      <div className="flex items-center my-1 mx-3">
        <Link to="/couponcustomer">
          <button className="w-10 rounded-full flex items-center justify-center">
            <img src={backbutton} alt="Back" className="w-full h-full" />
          </button>
        </Link>
        <h2 className="text-lg font-semibold text-center ms-[15%]">
          Add Coupon Customer
        </h2>
      </div>
      <div className="flex mb-1 justify-center  bg-gray-50">

        <div className="bg-white p-8 mb-2 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit}>
            {/* Search for customer */}
            <div className="relative">
              <label className="block text-[#484A4D] font-semibold text-left mb-2">Select Customer</label>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Search Customer"
              />
              {/* Dropdown for customer suggestions */}
              <div className="absolute z-10 w-full bg-white mt-1 max-h-52 overflow-auto rounded shadow-lg">
                {loading ? (
                  <div className="p-2 text-gray-500">Loading...</div>
                ) : customers.length > 0 ? (
                  <div>
                    {
                      filteredCustomers.map((customer: any) => (
                        <div
                          key={`${customer.customerID}-${customer.ratePerBottle}`}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div className="p-2 cursor-pointer m-2 border-2 rounded-lg hover:bg-gray-100"                                        >
                            {customer.fullName}
                          </div>
                        </div>
                      ))
                    }
                  </div>

                ) :
                  (
                    <div className="p-2">No customers found</div>
                  )}
              </div>
              <Link to={'/addcustomers'}>
                <div className="flex gap-1 my-1 cursor-pointer">
                  <img src={user} alt="" />
                  <p className="text-[#820000] text-[14px] font-semibold">Add New Customer</p>
                </div>
              </Link>
            </div>

            {/* Coupon */}
            <div className="mb-2">
              <label htmlFor="coupon" className="block text-[#484A4D] font-semibold text-left mb-2">
                Coupon
              </label>

              <select
                id="coupon"
                name="couponId"
                value={formData.couponId}
                onChange={handleCouponChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option className="text-[#BEC0C2]">Select Coupon</option>
                {/* Add options here */}
                {
                  coupons.map((coupon) => (
                    <option value={coupon._id}>{coupon.couponName}</option>
                  ))
                }
              </select>
            </div>

            <div className="">
              <label htmlFor="couponAmount" className="block text-left text-[#484A4D] font-semibold mb-2">
                Payment Mode
              </label>
              <div className="w-full px-4 py-2 border  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400" >
                Cash
              </div>
            </div>

            <div className="flex pt-2">
              <div className="w-full">
                <label className="block text-[#484A4D] font-semibold text-left mb-2">Deposit Account</label>
                <select
                  name="depositAccountId"
                  className="w-full p-2 mt-1 border rounded-md"
                  value={formData.depositAccountId}
                  onChange={handleDepositeChange} // Pass function reference
                  required
                >
                  <option value="">Select Account</option>
                  {Array.isArray(filteredAccounts) && filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account: any) => (
                      <option key={account._id} value={account._id}>
                        {account.accountName}
                      </option>
                    ))
                  ) : (
                    <option >No accounts available</option>
                  )}
                </select>
              </div>
            </div>

            {/* Coupon Amount */}
            <div className="mb-6">
              <label htmlFor="couponAmount" className="block text-left mt-2 text-[#484A4D] font-semibold mb-2">
                Coupon Amount
              </label>
              <input
                type=""
                id="couponAmount"
                name="couponAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter the coupon amount"
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className=" py-3 ">
              <Button size="xl" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Couponsale;
