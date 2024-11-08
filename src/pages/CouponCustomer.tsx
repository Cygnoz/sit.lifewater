
import coupon from '../assets/images/Group.svg'
import circle from '../assets/images/circle-plus.png'
import search from '../assets/images/search.svg'


import { Link } from 'react-router-dom';

const CouponCustomer: React.FC = () => {
return (
  <div>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6 pt-6">
     

      {/* Search bar and Add button */}
      <div className="w-full max-w-md flex items-center justify-between px-4 mb-8">
      <div className="relative w-full flex items-center">
{/* Search Input */}
<input
  type="text"
  placeholder="Search..."
  className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none focus:shadow-none"
/>
{/* Search Icon */}
<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
<img src={search} alt="Search Icon" className="w-4 h-4 text-gray-500" />
</div>
</div>
<Link to="/CouponSale">
          <img className='m-2' src={circle} alt="" />
      </Link>
</div>

      {/* Main illustration and text */}
      <div className="flex flex-col items-center">
        {/* Illustration Image */}
        <img src={coupon} alt="Illustration" className="w-32 h-35 object-cover mb-5 mt-5" />

        {/* No Return Customers Text */}
        <span className="text-gray-500 text-sm">No Customers</span>
      </div>
    </div>
  </div>
);
};

export default CouponCustomer;
