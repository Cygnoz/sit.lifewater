import React, { useState } from 'react';
import back from '../../assets/images/backbutton.svg'

const DeliverySettings: React.FC = () => {
  const [orderPrefix, setOrderPrefix] = useState<string>("");

 

  return (
    <div>
        <div className="icon-placeholder flex p-1">
         <img className='bg-gray-200 rounded-full p-2' src={back} alt="" />
         <h3 className='font-bold text-[20px] text-[#303F58] ms-2 '>Delivery Setting</h3>
        </div>
    <div className="flex flex-col bg-[white] mt-4 h-[343px] w-full h-screen bg-gray-100">
    
                <h2 className="text-[20px] font-bold text-center mt-3 mb-4">Set Order Number Prefix</h2>
              
      <div className="w-[668px]  ms-96 item-center bg-[#F6F6F6] rounded-lg shadow-lg p-6">
        <div className="mb-6 w-[628px]">
          <label className="block text-[#303F58] text-[18px] font-bold mb-2">Order Number Prefix</label>
          <p className="text-[#303F58] text-[15px] my-2">Current the Order Prefix: <span className="text-green-500">INV</span></p>
          <label className="block text-[#303F58] text-[14px] font-normal mb-2">Enter New Order - No Prefix</label>
          <input
            type="text"
            value={orderPrefix}
            onChange={(e) => setOrderPrefix(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Here"
          />
        </div>
       
      </div>
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
            Save
          </button>
        </div>
    </div>
    
    </div>
  );
};

export default DeliverySettings;