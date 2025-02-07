import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import searchIcon from "../assets/images/search (2).svg";
import plusIcon from "../assets/images/pluscircle.svg";
import phone from "../assets/images/phone.png";
import close from "../assets/images/x-mark.svg";
import { Box, Modal, Typography } from "@mui/material";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";

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
  CouponBottle:string,
  location: {
    address: string;
    coordinates: {
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
}

const ViewCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showLocation, setShowLocation] = useState(false);
  const navigate = useNavigate();
  const defaultImage =
    "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png";
  const { request: getAllCustomers } = useApi("get", 4000);
  const [loading, setLoading] = useState(false);

  // Get All customer
  const getALLCustomers = async () => {
    try {
      const url = `${endpoints.GET_ALL_CUSTOMERS}`;
      const { response, error } = await getAllCustomers(url);
      console.log("API RESPONSE :", response);

      if (!error && response) {
        setLoading(false);
        setCustomers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLCustomers();
  }, []);
  console.log(loading);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.fullName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (customer: Customer) => {
    console.log("Customer details:", customer);
    setSelectedCustomer(customer);
    setShowLocation(!!customer.location?.coordinates); // Show location iframe only if coordinates are available
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    setShowLocation(false);
  };
  const handleEdit = () => {
    if (selectedCustomer) {
      navigate(`/editcustomer/${selectedCustomer._id}`);
    }
  };
  return (
    <>
      <div className="min-h-screen p-4 bg-gray-100">
        {/* Search and Add Customer UI */}
        <div className=" w-full max-w-md flex items-center justify-between px-4 mb-8">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img src={searchIcon} alt="Search Icon" className="w-4 h-4" />
            </div>
          </div>
          <Link to="/addcustomers">
            <img className="m-2" src={plusIcon} alt="Add Customer" width={30} />
          </Link>
        </div>

        {/* Customer List */}
        <div>
          {filteredCustomers.map((customer) => {
            return (
              <div
                onClick={() => handleOpen(customer)}
                key={customer.id}
                className="flex items-center p-4 mb-2 bg-white rounded-xl shadow"
              >
                <div className="flex-1 flex gap-4">
                  <img
                    className="object-cover w-11 h-11 rounded-full"
                    src={customer.logo ? `${customer.logo}` : defaultImage}
                    alt={`${customer.fullName}`}
                  />
                  <div>
                    <div className="font-bold mb-1">{customer.fullName}</div>
                    <div className="text-sm mb-1">
                      Customer ID:{" "}
                      <span className="text-red-700 font-bold">
                        {customer.customerID}
                      </span>
                    </div>
                    <div className="text-sm">
                      Payment Mode -{" "}
                      <span className="text-red-700 font-bold">
                        {customer.paymentMode}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 p-3 hidden bg-green-200 text-white rounded-full">
                  <img
                    src={phone}
                    alt="Action Icon"
                    className="w-5 h-5 rounded-full"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={!!selectedCustomer}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "75%", md: "50%", lg: "40%" },
            maxWidth: "600px",
            bgcolor: "white",
            p: 1,
            borderRadius: 2,
            boxShadow: 24,
            m: "auto",
            mt: { xs: 2, sm: 4, md: 6 },
            textAlign: "center",
          }}
        >
          <div className="flex justify-end mb-5">
            <button
              onClick={handleClose}
              className="bg-rose-500 text-red p-2 rounded-full"
            >
              <img src={close} alt="Close" />
            </button>
          </div>
          <div className="bg-slate-100 p-2">
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              fontWeight="bold"
            >
              <span className="text-red-700">
                {selectedCustomer ? `${selectedCustomer.fullName}` : ""}
              </span>
            </Typography>
            <Typography id="modal-title" variant="h6" component="h2">
              Customer ID :{" "}
              <span className="text-red-500">
                {" "}
                {selectedCustomer?.customerID}
              </span>
            </Typography>
          </div>

          <Typography id="modal-description" sx={{ mt: 2 }}>
            {selectedCustomer && (
              <>
                <p className="mb-2">
                  <strong>Phone:</strong> {selectedCustomer.mobileNo}
                </p>
                <p className="mb-2">
                  <strong>Main Route:</strong> {selectedCustomer.mainRoute}
                </p>
                <p className="mb-2">
                  <strong>Sub Route:</strong> {selectedCustomer.subRoute}
                </p>
                <p className="mb-2">
                  <strong>Deposit Amount:</strong>{" "}
                  {selectedCustomer.depositAmount}
                </p>
                <p className="mb-2">
                  <strong>Rate Per Bottle:</strong>{" "}
                  {selectedCustomer.ratePerBottle}
                </p>
                <p className="mb-2">
                  <strong>No of Bottles:</strong>{" "}
                  {selectedCustomer.numberOfBottles}
                </p>
                {
                    selectedCustomer?.CouponBottle &&
                    <p className="mb-2">
                    <strong>Balance Coupons:</strong>{" "}
                    {selectedCustomer.CouponBottle}
                  </p>
                  }
              </>
            )}
          </Typography>
          {/* Conditional Rendering of Google Maps Iframe */}
          {showLocation && selectedCustomer?.location?.coordinates && (
            <div className="mt-4">
              <iframe
                src={`https://www.google.com/maps?q=${selectedCustomer.location.coordinates.coordinates[1]},${selectedCustomer.location.coordinates.coordinates[0]}&output=embed`}
                className="w-full h-[350px]"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          )}
          <button
            onClick={handleEdit}
            className="px-6 py-3 mt-4 bg-[#820000] text-white rounded-lg"
          >
            Edit
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default ViewCustomers;
