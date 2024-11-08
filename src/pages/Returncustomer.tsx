
import customer from '../assets/images/OBJECT.png';
import { Link } from 'react-router-dom';
import search from '../assets/images/search (2).svg';
import plus from '../assets/images/pluscircle.svg'


const Returncustomer: React.FC = () => {
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
<Link to="/addreturn">
            <img className='m-2' src={plus} alt="" />
        </Link>
        </div>

        {/* Main illustration and text */}
        <div className="flex flex-col items-center p-8 m-8">
          {/* Illustration Image */}
          <img src={customer} alt="Illustration" className="w-64 h-64 object-cover mb-4" />

          {/* No Return Customers Text */}
          <span className="text-gray-500 text-sm">No Return Customers</span>
        </div>
      </div>
    </div>
  );
};

export default Returncustomer;
