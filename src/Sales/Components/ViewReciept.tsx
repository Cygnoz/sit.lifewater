import { Link, useParams } from "react-router-dom";
import back from "../../assets/images/backbutton.svg";
import { useEffect, useState } from "react";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";

interface Receipt {
  orderNumber: string;
  createdAt: string;
  paidAmount: number;
  receiptNumber: string;
  fullName: string;
}

export const ViewReciept = () => {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { request: getReceipt } = useApi("get", 4001);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const url = `${endpoints.VIEW_ONE_RECIEPT}/${id}`;
        const { response, error } = await getReceipt(url);
        if (error) {
          setError("Failed to load receipt details.");
          return;
        }
        setReceipt(response?.data?.data);
      } catch (err) {
        setError("Something went wrong.");
      }
    };
    fetchReceipt();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!receipt) return <p>Loading receipt details...</p>;

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex-1 mt-2 p-2 overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          <div className="flex gap-3 items-center ">
            <Link to="/reciept">
              <button className="h-10 px-2.5 bg-[#f6f6f6] rounded-[56px]">
                <img src={back} alt="Back" />
              </button>
            </Link>
            <h2 className="text-xl font-bold">Receipt Details</h2>
          </div>
          <hr className="mt-2" />

  
<div className=" bg-gradient-to-r from-[#f7e7ce] to-[#e3e6d5]  p-4 rounded-lg mt-3">
        <p className="text-sm text-gray-500 mt-2">
            Receipt Number: <span className="font-bold">{receipt.receiptNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order Number: <span className="font-bold">{receipt.orderNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Customer Name: <span className="font-bold">{receipt.fullName}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Paid Amount: <span className="font-bold">{receipt.paidAmount} AED</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order Date:{" "}
            <span className="font-bold">
              {new Date(receipt.createdAt).toLocaleDateString("en-GB")}{" "} 
              
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order Time:{" "}
            <span className="font-bold">
            {new Date(receipt.createdAt).toLocaleTimeString()}
              
            </span>
          </p>
     
        </div>


          
        </div>
      </div>
    </div>
  );
};
