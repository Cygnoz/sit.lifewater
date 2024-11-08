import React from 'react';
import { Link } from 'react-router-dom';
import back from '../../assets/images/backbutton.svg';

const AddCollection: React.FC = () => {
  return (
    <div className='p-2'>
      {/* Header */}
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4">
        <Link to={'/salesman'}>
          <div className="icon-placeholder">
            <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Collection</h2>
      </div>

      {/* Form */}
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Date</label>
            <input
              type="date"
              defaultValue="2024-05-31"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Balance Amount */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Balance Amount</label>
            <input
              type="text"
              placeholder="Enter Balance Amount"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Select Salesman */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Select Sales Man</label>
            <select
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select sales man</option>
            </select>
          </div>

          {/* Amount Credited */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Amount Credited</label>
            <input
              type="text"
              placeholder="Enter Amount"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-1">
            <label className="block text-[#303F58] font-normal mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
        <Link to={'/salesman'}>
          <button
            className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-medium rounded-md border-2 border-[#565148] w-[74px] h-[38px]"
            type="button"
          >
            Cancel
          </button>
          </Link>
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

export default AddCollection;
