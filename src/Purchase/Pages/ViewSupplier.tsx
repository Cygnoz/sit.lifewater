import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import backbutton from "../../assets/images/backbutton.svg";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

const ViewSupplier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { request: getAnSupplier } = useApi("get", 4001);

  const getOneSupplier = async () => {
    try {
      const url = `${endpoints.GET_A_SUPPLIER}/${id}`;
      const { response, error } = await getAnSupplier(url);
      if (!error && response) {
        setSupplier(response.data?.data);
      }
    } catch (error) {
      setError("Failed to fetch supplier details");
    }
  };

  useEffect(() => {
    getOneSupplier();
  }, []);

  if (error) return <p>{error}</p>;
  if (!supplier) return <p>Loading supplier details...</p>;

  return (
    <div className="flex w-full">
      <div className="flex-1 mt-2 p-2 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          <div className="flex gap-3 items-center">
            <Link to="/suppliers">
              <button className="h-10 px-2.5 bg-[#f6f6f6] rounded-[56px]">
                <img src={backbutton} alt="Back" />
              </button>
            </Link>
            <h2 className="text-xl font-bold">Supplier Details</h2>
          </div>
          <hr className="mt-2" />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Supplier Information</p>
              <p className="text-sm text-gray-500 mt-4">Company Name</p>
              <p className="font-semibold">{supplier.companyName || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Full Name</p>
              <p className="font-semibold">{supplier.fullName || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Customer Type</p>
              <p className="font-semibold">{supplier.customerType || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Currency</p>
              <p className="font-semibold">{supplier.currency || "N/A"}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Contact Details</p>
              <p className="text-sm text-gray-500 mt-4">Mobile Number</p>
              <p className="font-semibold">{supplier.mobileNumber || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Work Phone 1</p>
              <p className="font-semibold">{supplier.customerPhone?.workPhone01 || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Work Phone 2</p>
              <p className="font-semibold">{supplier.customerPhone?.workPhone02 || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Email</p>
              <p className="font-semibold">{supplier.vendorEmail || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Location Details</p>
              <p className="text-sm text-gray-500 mt-4">State</p>
              <p className="font-semibold">{supplier.state || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">City</p>
              <p className="font-semibold">{supplier.city || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Place of Supply</p>
              <p className="font-semibold">{supplier.placeOfSupply || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Billing Address</p>
              <p className="font-semibold">{supplier.billingAddress || "N/A"}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold underline underline-offset-8">Additional Information</p>
              <p className="text-sm text-gray-500 mt-4">Vendor Website</p>
              <p className="font-semibold">{supplier.vendorWebsite || "N/A"}</p>
              <p className="text-sm text-gray-500 mt-4">Payment Terms</p>
              <p className="font-semibold">{supplier.paymentTerms || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSupplier;
