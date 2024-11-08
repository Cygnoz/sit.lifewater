import React, { useEffect, useState } from 'react';
import plus from '../assets/images/pluscircle.svg';
import { endRideAPI } from '../services/EndRide/EndRide';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Expense {
  id: number;
  remarks: string;
  amount: string;
}

const EndRide: React.FC = () => {
  const [endingKM, setEndingKM] = useState<string>('');
  const [travelledKM, setTravelledKM] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, remarks: '', amount: '' },
  ]);

  // State variables for data retrieved from localStorage
  const [storedID, setStoredID] = useState<string | null>(null);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [storeddriver, setStoreddriver] = useState<string | null>(null);
  const [storedvehicle, setStoredVehicle] = useState<string | null>(null);
  const [storedmainRoute, setStoredMainRoute] = useState<string | null>(null);
  const [storedstock, setStoredStock] = useState<string | null>(null);
  const [storedSubRoute, setStoredSubRoute] = useState<string | null>(null);
  const [storedkilometer, setStoredkilometer] = useState<string | null>(null);
 

  // Retrieve data from localStorage on component load
  useEffect(() => {
    setStoredID(localStorage.getItem("activeRouteId"));
    setStoredUsername(localStorage.getItem("firstname"));
    setStoreddriver(localStorage.getItem("driver"));
    setStoredVehicle(localStorage.getItem("vehicleNo"));
    setStoredMainRoute(localStorage.getItem("mainRoute"));
    setStoredStock(localStorage.getItem("stock"));
    setStoredSubRoute(localStorage.getItem("subRoute"))
    setStoredkilometer(localStorage.getItem("startingKm"))
  
  }, []);
  useEffect(() => {
    if (endingKM && storedkilometer) {
      const travelledKM = parseFloat(endingKM) - parseFloat(storedkilometer);
      setTravelledKM(travelledKM > 0 ? travelledKM.toString() : '0');
    }
  }, [endingKM, storedkilometer])

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: expenses.length + 1, remarks: '', amount: '' },
    ]);
  };

  const handleExpenseChange = (id: number, field: string, value: string) => {
    setExpenses(expenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleEndRideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!storedID) {
      toast.error("No active route ID found.");
      return;
    }
  
    const payload = {
      activeRouteId: storedID,
      salesMan: storedUsername ?? "",    // Fallback to empty string if null
      driver: storeddriver ?? "",
      vehicleNo: storedvehicle ?? "",
      mainRoute: storedmainRoute ?? "",
      stock: storedstock ?? "",
      subRoute: storedSubRoute ?? "",
  
      endingKM: parseFloat(endingKM),
      travelledKM: parseFloat(travelledKM),
      expenses: expenses.map(({ remarks, amount }) => ({
        remarks,
        amount: amount.toString(),
      })),
    };
  
    try {
      const response = await endRideAPI(payload);
      console.log("End ride response:", response);
      toast.success("Ride ended successfully");
      setEndingKM("");
      setTravelledKM("");
      setExpenses([{ id: 1, remarks: "", amount: "" }]);
    } catch (error) {
      console.error("Error ending ride:", error);
      toast.error("Failed to end the ride");
    }
  };
  
console.log(storeddriver , storedmainRoute ,storedstock ,storedvehicle);

  return (
    <div className="p-6 bg-gray-100 min-h-screen items-center justify-center">
      <form onSubmit={handleEndRideSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700">Ending Kilometer</label>
          <input
            type="number"
            value={endingKM}
            onChange={(e) => setEndingKM(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter ending kilometer"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Travelled Kilometer</label>
          <input
            type="number"
            value={travelledKM}
            onChange={(e) => setTravelledKM(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        {expenses.map((expense) => (
          <div key={expense.id} className="mb-4">
            <div className="flex mb-2">
              <label className="block text-gray-700 mr-2">Expense {expense.id}</label>
              <button type="button" onClick={addExpense} className="ml-auto text-blue-500">
                <img className="m-2" src={plus} alt="Add expense" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={expense.remarks}
                onChange={(e) => handleExpenseChange(expense.id, 'remarks', e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Remarks"
              />
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Amount"
              />
            </div>
          </div>
        ))}
        <button type="submit" className="w-full bg-[#820000] text-white p-2 rounded mt-4">
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EndRide;
