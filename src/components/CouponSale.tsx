

import React, { useState } from "react";

const Couponsale: React.FC = () => {
  const [formData, setFormData] = useState({
    customer: "",
    coupon: "",
    validFrom: "",
    validTo: "",
    quantity: "",
    couponAmount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Handle form submission here
  };

  return (
    <div className="flex mb-1 justify-center max-h-screen bg-gray-50">
      <div className="bg-white p-8 mb-2 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {/* Search for customer */}
          <div className="mb-4">
            <label htmlFor="customer" className="block text-[#484A4D] text-left font-semibold mb-2">
              Search For Customer
            </label>
            <select
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option className="text-[#BEC0C2]" value="">Search customer</option>
              {/* Add options here */}
              <option value="customer1">Customer 1</option>
              <option value="customer2">Customer 2</option>
            </select>
          </div>

          {/* Coupon */}
          <div className="mb-4">
            <label htmlFor="coupon" className="block text-[#484A4D] font-semibold text-left mb-2">
              Coupon
            </label>
            <input 
              type=""
              placeholder="0"
              id="coupon"
              name="coupon"
              value={formData.coupon}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-[#BEC0C2]"
            />
          </div>

          {/* Valid From and Valid To */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="validFrom" className="block text-[#484A4D] text-left font-semibold mb-2">
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label htmlFor="validTo" className="block text-left text-[#484A4D] font-semibold mb-2">
                Valid To
              </label>
              <input
                type="date"
                id="validTo"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-left text-[#484A4D] font-semibold mb-2">
              Quantity
            </label>
            <input
              type=""
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-[#BEC0C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter the quantity"
            />
          </div>

          {/* Coupon Amount */}
          <div className="mb-6">
            <label htmlFor="couponAmount" className="block text-left text-[#484A4D] font-semibold mb-2">
              Coupon Amount
            </label>
            <input
              type=""
              id="couponAmount"
              name="couponAmount"
              value={formData.couponAmount}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-[#BEC0C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter the coupon amount"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="w-40 py-2 border rounded-lg text-[#820000] border-red-600 hover:bg-red-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-40 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Couponsale;
