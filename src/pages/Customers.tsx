import { Link } from "react-router-dom";
import Button from "../CommonComponents/Button";
import Circle_dollar_sign from "../assets/images/Icons/Circle_dollar_sign";
import Receipt_ndian_rupee from "../assets/images/Icons/Receipt_ndian_rupee";
import { useEffect, useState } from "react";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";

interface Customer {
  id: number;
  _id: string;
  fullName: string;
  message: string;
  depositAmount: number;
  ratePerBottle: number;
  numberOfBottles: number;
  logo: string;
  mobileNo: string;
  customerID: string;
  subRoute: string;
  mainRoute: string;
  paymentMode: string;
  location: {
    address: string;
    coordinates: {
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cashSales, setCashSales] = useState<number>(0);
  const [creditSales, setCreditSales] = useState<number>(0);
  const [focSales, setFocSales] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const { request: getAllCustomers } = useApi("get", 4000);

  // Get all customers from API
  const getALLCustomers = async () => {
    try {
      const url = `${endpoints.GET_ALL_CUSTOMERS}`;
      const { response, error } = await getAllCustomers(url);
      console.log("API RESPONSE:", response);

      if (!error && response) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLCustomers();
  }, []);

  // Filter customers by paymentMode and calculate sales amounts
  useEffect(() => {
    const cashFiltered = customers.filter((customer) => customer.paymentMode === "Cash");
    const creditFiltered = customers.filter((customer) => customer.paymentMode === "Credit");
    const CouponFiltered = customers.filter((customer) => customer.paymentMode === "Coupon");

    setCashSales(cashFiltered.length);
    setCreditSales(creditFiltered.length);
    setFocSales(CouponFiltered.length);
  }, [customers]);

  // Function to handle category click
  const handleCategoryClick = (mode: string) => {
    setSelectedMode(mode);
  };

  // Filtered customers based on selected payment mode
  const filteredCustomers = selectedMode
    ? customers.filter((customer) => customer.paymentMode === selectedMode)
    : [];

  const card = [
    {
      icon: <Receipt_ndian_rupee />,
      title: "Cash Customers",
      amount: cashSales,
      mode: "Cash",
    },
    {
      icon: <Circle_dollar_sign />,
      title: "Credit Customers",
      amount: creditSales,
      mode: "Credit",
    },
    {
      icon: <Receipt_ndian_rupee />,
      title: "Coupon Customers",
      amount: focSales,
      mode: "Coupon",
    },
  ];

  return (
    <div className="min-h-screen p-4 space-y-4 bg-[#F5F6FA] pb-64">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-4 bg-[#FFFFFF] rounded-lg shadow-md border border-gray-200 col-span-2">
          <div className="space-y-4">
            {card.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-[#F5F6FA] rounded-lg shadow-md border border-gray-200 cursor-pointer"
                onClick={() => handleCategoryClick(item.mode)}
              >
                <div className="flex items-center">
                  <span className="bg-[#E3E6D5] w-12 h-12 flex items-center justify-center rounded-full">
                    <p className="text-xl font-bold text-[#820000]">{item.amount}</p>
                  </span>
                  <div className="ml-4">
                    <p className="text-md font-semibold text-[#787A7D]">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Display filtered customers */}
      {selectedMode && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#820000]">
              {selectedMode} Customers ({filteredCustomers.length})
            </h2>
            <button
              onClick={() => setSelectedMode(null)}
              className="text-xl font-bold text-red-900 "
            >
              X
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {filteredCustomers.map((customer) => (
              <li key={customer._id} className="p-3 bg-gray-100 rounded-lg shadow">
                <p className="text-md font-semibold text-gray-800">{customer.fullName}</p>
                <p className="text-sm text-gray-600">Mobile: {customer.mobileNo}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Customers Button */}
      <div className="mt-6">
        <div className="mb-2">

        <Link to={"/addcustomers"}>
          <Button size="xl" variant="primary">Add Customer</Button>
        </Link>
        </div>
        <Link to={"/viewcustomers"}>
          <Button size="xl" variant="primary">All Customers</Button>
        </Link>
      </div>
    </div>
  );
};

export default Customers;
