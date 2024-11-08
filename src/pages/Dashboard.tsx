import React from 'react';
import stock from '../assets/images/Frame 629278.png'
const Dashboard: React.FC = () => {


  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
       <div className="flex gap-3">
       <div className="w-1/3 p-2 bg-white rounded-xl shadow">
       <img src={stock} alt="" width={40} />
          <h2 className="text-xl font-bold text-[#820000] mt-2">38 </h2>
          <p className="text-gray-600 font-semibold">Stock balance</p>
        </div>
        <div className="w-1/3 p-2 bg-white rounded-xl shadow">
       <img src={stock} alt="" width={40} />
          <h2 className="text-xl font-bold text-[#820000] mt-2">38 </h2>
          <p className="text-gray-600 font-semibold">Stock balance</p>
        </div>
        <div className="w-1/3 p-2 bg-white rounded-xl shadow">
       <img src={stock} alt="" width={40} />
          <h2 className="text-xl font-bold text-[#820000] mt-2">38 </h2>
          <p className="text-gray-600 font-semibold">Stock balance</p>
        </div>
       </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">Cash Sale</h2>
          <p className="text-gray-600">0 AED</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">Credit Sale</h2>
          <p className="text-gray-600">0 AED</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">Total Sale Amount</h2>
          <p className="text-gray-600">0 AED</p>
        </div>
        <div  className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">My Pending Amount</h2>
          <p className="text-gray-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
