
import { ToastContainer, toast } from "react-toastify";
import Button from "../CommonComponents/Button";
import { useEffect, useState } from "react";
import plus from "../assets/images/Icons/circle-plus.svg";
import trash from "../assets/images/Icons/trash.svg";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";

interface Expense {
  remarks: string;
  amount: string;
}
interface EndRideData {
  rideId: string,
  endingKM: string,
  travelledKM: string,
  expenses: Expense[]
}
type Props = {}

const EndRide = ({ }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingKM, setStartingKM] = useState<any | null>(null);
  const [endRideData, setEndRideData] = useState<EndRideData>({
    rideId: "",
    endingKM: "",
    travelledKM: "",
    expenses: [
      {
        remarks: "",
        amount: "",
      }
    ]
  })
  console.log(endRideData);
  const navigate = useNavigate()

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name === "endingKM") {
      // Allow empty value for backspace handling
      if (value === "") {
        setEndRideData((prev) => ({
          ...prev,
          endingKM: "",
          travelledKM: "", // Reset travelledKM
        }));
        setError(null); // Clear error if any
        return;
      }

      // Validate and calculate traveled KM
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        if (startingKM !== null && numericValue <= startingKM) {
          setError("Ending KM must be greater than Starting KM.");
          setEndRideData((prev) => ({
            ...prev,
            endingKM: value,
            travelledKM: "", // Reset travelledKM if invalid
          }));
          return;
        } else {
          setError(null); // Clear error if validation passes
          setEndRideData((prev) => ({
            ...prev,
            endingKM: value,
            travelledKM: startingKM !== null ? (numericValue - startingKM).toString() : "",
          }));
        }
      }
    } else if (name.startsWith("expenses")) {
      // Handle dynamic expenses input
      const [_, index, key] = name.split(".");
      const updatedExpenses = [...endRideData.expenses];
      updatedExpenses[parseInt(index)][key as keyof Expense] = value;

      setEndRideData((prev) => ({
        ...prev,
        expenses: updatedExpenses,
      }));
    } else {
      setEndRideData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addExpenseField = () => {
    setEndRideData({
      ...endRideData,
      expenses: [...endRideData.expenses, { remarks: "", amount: "" }],
    });
  };

  const deleteExpenseField = (index: number) => {
    const updatedExpenses = endRideData.expenses.filter((_, i) => i !== index);
    setEndRideData({
      ...endRideData,
      expenses: updatedExpenses,
    });
  };

  // Fetch activeroute with sales id
  const { request: getActiveRoute } = useApi("get", 4000);
  const SalesManId = localStorage.getItem("SalesManId");

  const fetchActiveRoute = async () => {
    setLoading(true); // Start loading
    try {
      const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
      const { response, error } = await getActiveRoute(url);
      console.log("Active route with sales id:", response?.data?.activeRide);

      if (!error && response) {
        const activeRide = response?.data?.activeRide;
        if (activeRide) {
          setStartingKM(activeRide?.startingKm);
          setEndRideData((prevData) => ({
            ...prevData,
            rideId: activeRide?._id,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchActiveRoute();
  }, []);

  const { request: EndRide } = useApi("put", 4000);
  const handleSubmit = async () => {
    if (error) {
      toast.error(error)
      return;
    }
    if (!endRideData.endingKM) {
      toast.error("Please fill the fields")
      return;
    }
    try {
      const url = `${endpoints.END_Ride}`;
      const { response, error } = await EndRide(url, endRideData)
      if (!error && response) {
        console.log("Response", response);
        toast.success(response?.data.message || "End Ride Successfull...");
        setTimeout(() => {
          navigate('/home')

        }, 1000)
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to save");
      }
      // toast.error(error.response.data.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to save EndRide");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="p-6 bg-gray-100 min-h-screen items-center justify-center">
        <form className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <h1 className="py-3">
              Starting KM : <span className="font-semibold">{startingKM ? startingKM : "N/A"}</span>
            </h1>
            <label className="block text-gray-700">Ending Kilometer</label>
            <input
              type="text"
              name="endingKM"
              value={endRideData.endingKM}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter ending kilometer"
              required
            />
          </div>
          {error && <div className="text-red-500 text-center text-sm mt-1">{error}</div>}
          <div className="mb-4">
            <label className="block text-gray-700">Travelled Kilometer</label>
            <input
              type="text"
              name="travelledKM"
              value={endRideData.travelledKM}
              readOnly
              className="w-full mt-1 p-2 border rounded border-gray-300"
            />
          </div>
          <div className="mb-4">
            <div className="flex  justify-end my-2">
              <button className="flex gap-2" type="button" onClick={addExpenseField}>
                Add Expenses <img src={plus} alt="" />
              </button>
            </div>
            {endRideData.expenses.map((expense, index) => (
              <div key={index} className="mb-3">
                <h4 className="">Expense {index + 1}</h4>
                <div className="flex  gap-2">

                  <input
                    type="text"
                    name={`expenses.${index}.remarks`}
                    value={expense.remarks}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Remarks"
                  />
                  <input
                    type="text"
                    name={`expenses.${index}.amount`}
                    value={expense.amount}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Amount"
                  />
                  {endRideData.expenses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteExpenseField(index)}
                    >
                      <img src={trash} className="text-red size-12" alt="" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </form>
        {loading ? (
          <div className="text-center p-4">
            <p>Loading data, please wait...</p>
          </div>
        ) : (
          <div className="py-5">
            <Button onClick={handleSubmit} type="submit" size="xl">
              Submit
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}

export default EndRide