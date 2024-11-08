import React from 'react';
import img from '../assets/images/banking-image 1.png';
import { Link } from 'react-router-dom';
import plus from '../assets/images/pluscircle.svg'
import search from '../assets/images/search (2).svg';

// PaymentCollection component with TypeScript
const PaymentCollection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6 pt-6">
      {/* Search bar and Add button */}
      <div className="w-full max-w-md flex items-center justify-between px-4 mb-8">
      <div className="relative w-full flex items-center">
        
  {/* Search Input */}
<input
    type="text"
    placeholder="Search"
    className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none focus:shadow-none"
  />
  {/* Search Icon */}
<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
<img src={search} alt="Search Icon" className="w-4 h-4 text-gray-500" />
</div>
</div>
        <Link to="/creditcollection">
            <img className='m-2' src={plus} alt="" />
        </Link>
      </div>

      {/* Main illustration and text */}
      <div className="flex flex-col items-center p-8 m-8">
        {/* Illustration Image */}
        <img
          src={img}
          alt="Illustration"
          className="w-54 h-54 object-cover mb-6 "
        />

        {/* No Payment Collection Text */}
        <span className="text-[#787A7D] text-sm font-medium">No Payment Collection</span>
      </div>
    </div>
  );
};

export default PaymentCollection;
