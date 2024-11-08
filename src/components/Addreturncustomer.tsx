import React, { useState } from 'react';

const Addreturncustomer: React.FC = () => {
  // You can add state for form handling if needed
  const [date, setDate] = useState<string>('');
  // const [searchTerm, setSearchTerm] = useState<string>('');
  const [bottlesInHand, setBottlesInHand] = useState<string>('');
  const [returnBottle, setReturnBottle] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [returnDepositAmount, setReturnDepositAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
        <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
          {/* Form Start */}
          <form onSubmit={handleSubmit}>
            {/* Date Field */}
            <div className="mb-4">
              <label className="block font-medium text-[#484A4D] mb-2 text-left">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              />
            </div>

            {/* Search for Customer */}
            <div className="mb-4">
          <label htmlFor="customer" className="block text-sm font-medium text-[#484A4D] text-left">
            Search For Customer
          </label>
          <select
            id="customer"
            name="customer"
            value=''
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
          >
            <option value="" disabled>
             Search customer
            </option>
            {/* Add options dynamically */}
            <option value="customer1">felecia</option>
            <option value="customer2">kim</option>
            <option value="customer3">bom</option>

          </select>
        </div>

            {/* Number Of Bottles In Hand */}
            <div className="mb-4">
              <label className="block font-medium text-[#484A4D] mb-2 text-left ">Number Of Bottles In Hand</label>
              <input
                type="text"
                placeholder="Enter No of Bottles In Hand"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={bottlesInHand}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBottlesInHand(e.target.value)}
              />
            </div>

            {/* Return Bottle */}
            <div className="mb-4">
              <label className="block font-medium text-[#484A4D] mb-2 text-left">Return Bottle</label>
              <input
                type="text"
                placeholder="Return Bottle"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={returnBottle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReturnBottle(e.target.value)}
              />
            </div>

            {/* Deposit Amount */}
            <div className="mb-4">
              <label className="block font-medium text-[#484A4D] mb-2 text-left">Deposit Amount</label>
              <input
                type="text"
                placeholder="Enter the Deposit Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={depositAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepositAmount(e.target.value)}
              />
            </div>

            {/* Return Deposit Amount */}
            <div className="mb-4">
              <label className="block font-medium text-[#484A4D] mb-2 text-left">Return Deposit Amount</label>
              <input
                type="text"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                value={returnDepositAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReturnDepositAmount(e.target.value)}
              />
            </div>

            {/* Remarks */}
            <div className="mb-4">
              <label className="block font-medium text-[#484A4D] mb-2 text-left">Remarks</label>
              <input
                type="text"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                value={remarks}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemarks(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full bg-[#820000] text-[#FEFDF9] px-6 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addreturncustomer;
