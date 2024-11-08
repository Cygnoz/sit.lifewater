import React from 'react';

import { Link } from 'react-router-dom';
import back from '../../assets/images/backbutton.svg';
import settings from '../../assets/images/settings.svg'

const AddPaymentReceipt: React.FC = () => {
  return (
    <div className='p-2'>
      {/* Header with Back Button */}
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4">
        <Link to={'/paymentreciept'}>
          <div className="icon-placeholder">
            <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Payment Receipt</h2>
      </div>

      {/* Form */}
      <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-5">
          {/* Supplier */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Supplier</label>
            <select
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select Vendor</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Type</label>
            <select
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Purchase Payment</option>
            </select>
          </div>

          {/* Payment Receipt # */}
          <div>
  <label className="block text-[#303F58] font-normal mb-1">Payment Receipt #</label>
  <div className="flex items-center border rounded-md">
    <input
      type="text"
      value="PAY 00002"
      className="w-full px-3 py-2 text-[#8F99A9] font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
      readOnly
    />
    {/* Placeholder for the icon (e.g., a gear icon) */}
    <div className="px-2">
      <img src={settings} alt="Settings Icon" className="w-5 h-5" /> {/* You can replace the src with your icon path */}
    </div>
  </div>
</div>


          {/* Payment Method */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Payment Method</label>
            <select
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select Payment Method</option>
            </select>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Reference Number</label>
            <input
              type="text"
              placeholder="Enter Reference Number"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Find By Sale */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Find By Sale #</label>
            <input
              type="text"
              placeholder="Enter Sales Number"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Purchase Order Date */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Purchase Order Date</label>
            <input
              type="date"
              defaultValue="2024-05-31"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Account</label>
            <select
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select Account</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-1">
            <label className="block text-[#303F58] font-normal mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              className="w-full px-3 py-1 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
        <Link to={'/paymentreciept'}>
          <button
            className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-medium rounded-md border-2 border-[#565148] w-[74px] h-[38px]"
            type="button"
          >
            Cancel
          </button></Link>
          <button
            className="px-3 py-1 bg-[#820000] text-[#FEFDF9] font-medium rounded-md w-[142px] h-[38px]"
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentReceipt;
