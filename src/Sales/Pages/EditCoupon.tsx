import React from 'react';
import { Link } from 'react-router-dom';
import back from '../../assets/images/backbutton.svg';

const EditCoupon: React.FC = () => {
  return (
    <div className='p-2'>
      {/* Header */}
      <div className="flex gap-3 items-center w-full max-w-8xl mb-4">
        <Link to={'/'}>
          <div className="icon-placeholder">
            <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-[20px] text-[#303F58] font-bold">Edit Coupon</h2>
      </div>

      {/* Form */}
      <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coupon Name */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Coupon Name</label>
            <input
              type="text"
              placeholder="Coupon Name"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Price</label>
            <input
              type="number"
              placeholder="Enter Price"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Description</label>
            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Bottles */}
          <div>
            <label className="block text-[#303F58] font-normal mb-1">Bottles</label>
            <input
              type="number"
              placeholder="Enter Number Of Bottles"
              className="w-full px-3 py-2 text-[#8F99A9] font-normal border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-medium rounded-md border-2 border-[#565148] w-[74px] h-[38px]"
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-[#820000] text-[#FEFDF9] font-medium rounded-md w-[142px] h-[38px]"
            type="submit"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
