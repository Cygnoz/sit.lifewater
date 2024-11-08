import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const CreditCollection: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    customer: '',
    invoiceNumber: '',
    invoiceAmount: '',
    remainingAmount: '',
    collectAmount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-[#484A4D] text-left">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="customer" className="block text-sm font-medium text-[#484A4D] text-left">
            Search For Customer
          </label>
          <select
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

        <div className="mb-4">
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-[#484A4D] text-left">
            Invoice Number
          </label>
          <input
            type="number"
            id="invoiceNumber"
            name="invoiceNumber"
            placeholder="Enter the quantity"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="invoiceAmount" className="block text-sm font-medium text-[#484A4D] text-left">
            Invoice Amount
          </label>
          <input
            type="number"
            id="invoiceAmount"
            name="invoiceAmount"
            placeholder="Enter the Invoice amount"
            value={formData.invoiceAmount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="remainingAmount" className="block text-sm font-medium text-[#484A4D] text-left">
            Remaining Amount
          </label>
          <input
            type="number"
            id="remainingAmount"
            name="remainingAmount"
            placeholder="Enter the remaining amount"
            value={formData.remainingAmount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="collectAmount" className="block text-sm font-medium text-[#484A4D]  text-left">
            Collect Amount
          </label>
          <input
            type="number"
            id="collectAmount"
            name="collectAmount"
            placeholder="Enter the Collect amount"
            value={formData.collectAmount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
          />
        </div>

          {/* Total Outstanding Amount with border */}
        <div className="border border-gray-300 rounded-lg p-1 mt-6 text-center">
          <p className="text-[#787A7D] font-medium">Total Outstanding Amount</p>
          <p className="text-[#820000] font-bold text-xl">0</p>
        </div>

         {/* Buttons */}
         <div className="flex justify-between mt-5">
          <Link to={'/collection'}>
          <button className=" py-1 px-8 bg-[#F6F6F6] text-[#820000] border border-red-500 rounded-lg hover:bg-gray-100 m-2">
            Cancel
          </button>
          </Link>
          <button className="py-1 px-8 bg-[#820000] text-[#FEFDF9] rounded-lg m-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCollection;
