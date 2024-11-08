 import rupee from '../assets/images/receipt-indian-rupee.svg';
 import dollar from '../assets/images/circle-dollar.svg';
import { Link } from 'react-router-dom';


// Define the props interface

const Customers: React.FC = () => {
  return (
    <div className="min-h-screen p-4 space-y-4 bg-[#F5F6FA] pb-64">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-4 bg-[#FFFFFF] rounded-lg shadow-md border border-gray-200 col-span-2">
          <div className="space-y-4">
            {/* Cash Sale Section */}
            <div className="flex justify-between items-center p-4 bg-[#F5F6FA] rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <span className="bg-[#E3E6D5] p-2 rounded-full">
                  <img src={rupee} alt="Icon" className="w-6 h-6" />
                </span>
                <div className="ml-4">
                  <p className="text-xl font-bold text-[#820000]">0 AED</p>
                  <p className="text-sm font-medium text-[#787A7D]">Cash Sale</p>
                </div>
              </div>
            </div>

            {/* Membership Customer Section */}
            <div className="flex justify-between items-center p-4 bg-[#F5F6FA] rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <span className="bg-[#E3E6D5] p-2 rounded-full">
                  <img src={dollar} alt="Icon" className="w-6 h-6" />
                </span>
                <div className="ml-4">
                  <p className="text-xl font-bold  text-[#820000]">0 AED</p>
                  <p className="text-sm font-medium text-[#787A7D]">Cash Sale</p>
                </div>
              </div>
            </div>

            {/* Membership Section */}
            <hr />
            <div className="flex justify-between items-center p-4 bg-[#F3E6E6] rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <span className="bg-[#FFFFFF] p-2 rounded-full">
                  <img src={rupee} alt="Icon" className="w-6 h-6" />
                </span>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#787A7D]">Membership Customer</p>
                  <p className="text-xl font-bold  text-[#820000] mr-20">0 AED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Customers Button */}
      <div >
        <Link to={'/viewcustomers'}>
        <button className="w-full md:w-96 py-3 bg-[#820000] text-white font-bold rounded-lg">
          All Customers
        </button>
        </Link>
      </div>
    </div>
  );
}

export default Customers;
