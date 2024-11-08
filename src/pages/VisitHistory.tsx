import React, { useState } from 'react';
import filter from '../assets/images/filter.svg';
import rupee from '../assets/images/rupees.svg';
import tags from '../assets/images/tags.svg';
import handcoin from '../assets/images/handcoin.svg';
import monica from '../assets/images/monica.svg';
import kim from '../assets/images/kim.svg';
import visited from '../assets/images/visited.svg';
import notvisited from '../assets/images/notvisited.svg';
import search from '../assets/images/search (2).svg';




const Visithistory: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen w-full max-w-screen-xl mx-auto bg-gray-100 p-4"

>
      {/* First Row: Search Bar with Filter Icon */}
      <div className="relative w-full flex items-center">
    
      <input
    type="text"
    placeholder="Search"
    className="pl-10 pr-4 text-sm w-full rounded-xl text-gray-800 h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none focus:shadow-none"
  />
  
  {/* Search Icon */}
  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
    <img src={search} alt="Search Icon" className="w-5 h-5 text-gray-500" />
  </div>
        {/* Filter Icon */}
        <button onClick={toggleDropdown} className="p-2">
          <img src={filter} alt="Filter Icon" className="w-5 h-5" />
        </button>

        {/* Filter Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="p-2">
            <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center">
             <img src={visited} alt=""   className="w-4 h-4 mr-2"/>
              Visited
            </li><hr />
            <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center">
              <img src={notvisited} alt=""  className="w-4 h-4 mr-2" />
              Not Visited
            </li><hr />
            <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center">
               <img src={visited} alt=""  className="w-4 h-4 mr-2"/>
              Delivered
            </li><hr />
            <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center">
               <img src={notvisited} alt=""  className="w-4 h-4 mr-2" />
              Not Delivered
            </li>
          </ul>
        </div>
        
        )}
      </div>

      {/* Second Row: Three Cards */}
      <div className="flex justify-between gap-4 mt-6">
        {/* Visited Customers Card */}
        <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-xs">
          {/* Icon with custom red circular background */}
          <div className="mb-2 flex items-center justify-center w-12 h-12" style={{ backgroundColor: '#820000', borderRadius: '50%' }}>
            <img src={rupee} alt="Visited Icon" className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-medium text-[#820000]">0</h2>
          <p className="font-bold text-[#787A7D] text-sm">Visited Customers</p>
        </div>

        {/* Not Visited Customers Card */}
        <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-xs">
          {/* Icon with custom red circular background */}
          <div className="mb-2 flex items-center justify-center w-12 h-12" style={{ backgroundColor: '#820000', borderRadius: '50%' }}>
            <img src={tags} alt="Not Visited Icon" className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-medium text-[#820000]">2</h2>
          <p className="font-bold text-[#787A7D] text-sm">Not Visited Customers</p>
        </div>

        {/* Total Customers Card */}
        <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-xs">
          {/* Icon with custom red circular background */}
          <div className="mb-2 flex items-center justify-center w-12 h-12" style={{ backgroundColor: '#820000', borderRadius: '50%' }}>
            <img src={handcoin} alt="Total Customers Icon" className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-medium text-[#820000]">2</h2>
          <p className="font-bold text-[#787A7D]  text-sm">Total Customers</p>
        </div>
      </div>

      {/* Third and Fourth Row: Large Customer Cards */}
      <div className="mt-6 space-y-4">
        {/* Customer 1 */}
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
          {/* Image and Name */}
          <div className="flex items-center">
            <img src={monica} alt="" className="w-10 h-10" /> {/* Adjust image size for mobile */}
            <div className="ml-4">
              <h3 className="font-medium text-[#484A4D] text-sm md:text-base">Monica Geller</h3> {/* Adjust font size */}
            </div>
          </div>

          {/* Status Badges */}
          <div className="space-x-1 space-y-2">
            <span className="px-2 py-1 text-xs font-semibold bg-[#FEEDDA] text-[#FAA745] rounded-xl flex items-center">
              <span className="text-[#FAA745] mr-1 text-sm">&bull;</span> Not Delivered
            </span>
            <span className="px-2 py-1 text-xs font-semibold bg-[#CEEFDF] text-[#0AAF60] rounded-xl flex items-center">
              <span className="text-[#0AAF60] mr-1 text-sm">&bull;</span> Not Delivered
            </span>
          </div>
        </div>

        {/* Customer 2 */}
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
          {/* Image and Name */}
          <div className="flex items-center">
            <img src={kim} alt="" className="w-10 h-10" /> {/* Adjust image size for mobile */}
            <div className="ml-4">
              <h3 className="font-medium text-[#484A4D]  text-sm md:text-base">Kim Taehyung</h3> {/* Adjust font size */}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col space-y-2">
            <span className="px-2 py-1 text-xs font-semibold bg-[#F6F6F6] text-[#820000] rounded-xl flex items-center">
              <span className="text-[#820000] mr-1 text-sm">•</span> Not Delivered
            </span>
            <span className="px-2 py-1 text-xs font-semibold bg-[#F6F6F6]  text-[#820000] rounded-xl flex items-center">
              <span className="text-[#820000] mr-1 text-sm">•</span> Not Delivered    
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visithistory;
