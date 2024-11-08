import vector from "../../assets/images/Vector.svg";
import trash from "../../assets/images/trash.svg";
import circleplus from '../../assets/images/Icon.svg';
import printer from '../../assets/images/printer.svg';
import back from '../../assets/images/backbutton.svg';
import settings from '../../assets/images/settings.svg';

import { Link } from 'react-router-dom';

const AddCreditNote: React.FC = () => {
  return (
    <div className="flex">
      {/* Left Content */}
      <div className="w-[65%] p-2">

        {/* Header Section */}
        <div className="flex items-center mb-6">
          <Link to="/creditnote">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </Link>
          <h3 className="text-[20px] text-[#303F58] font-bold ms-2">New Credit Note</h3>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* First Row of Inputs */}
          <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
              <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Customer</label>
              <select className="w-full p-3 border rounded-md text-[#8F99A9] text-[14px]">
                <option value="">Select Customer</option>
              </select>
            </div>

            <div>
            <label className="block text-[#303F58] font-normal mb-1">Debit Note #</label>
            <div className="flex items-center border rounded-md">
              <input
                type="text"
                value="PAY 00002"
                className="w-full px-3 py-2 text-[#8F99A9] font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <div className="px-2">
                <img src={settings} alt="Settings Icon" className="w-5 h-5" />
              </div>
            </div>
          </div>

          </div>

          {/* Second Row of Inputs */}
          <div className="grid grid-cols-2 gap-6 mb-4">

          <div>
              <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-md text-[#8F99A9] text-[14px]"
                placeholder="Select date"
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
  </div>

          {/* Add Item Section */}
          <div className="mb-4">
            <h5 className="font-bold text-[16px] text-[#202224] mb-2">Add Product</h5>

            <table className="w-full text-left border-collapse">
  <thead className="bg-[#fdf8f0]">
    <tr className="border-b">
      <th className="p-3 text-center text-[#495160] text-[12px] font-medium">Product</th>
      <th className="p-3 text-center text-[#495160] text-[12px] font-medium">Quantity</th>
      <th className="p-3 text-center text-[#495160] text-[12px] font-medium">Rate</th>
      <th className="p-3 text-center text-[#495160] text-[12px] font-medium">Amount</th>
      <th className="p-3 text-center text-[#495160] text-[12px] font-medium">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b">
      <td className="p-3 text-center">
        <select className="border p-2 text-gray-400 w-full">
          <option value="">Type or click</option>
        </select>
      </td>
      <td className="p-3 text-center text-[#8F99A9] text-[14px]">0</td>
      <td className="p-3 text-center text-[#8F99A9] text-[14px]">0.00</td>
      <td className="p-3 text-center text-[#8F99A9] text-[14px]">0.00</td>
      <td className="px-4 py-3 text-center">
                    <button   className="text-green-500 mr-2">
                      <img src={vector} alt="Edit" />
                    </button>
                    <button  className="text-red-500">
                      <img src={trash} alt="Delete" />
                    </button>
                  </td>
    </tr>
  </tbody>
</table>


            <button className="mt-4 flex text-[#820000]" type="button">
              <img className="my-1 mx-1" src={circleplus} alt="Add Product" />
              Add Product
            </button>
          </div>

          {/* Notes Section */}
          <div className="mb-4">
            <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Add Notes</label>
            <textarea
              className="w-full p-3 border rounded-md text-[#8F99A9] text-[14px]"
              placeholder="Add a Note"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[30%] p-4  h-[250px]  mt-20 bg-white shadow-md rounded-lg">
  <div className="flex flex-col items-start">
    <div className="flex justify-between w-full mb-1">
      <span className="text-[#4B5C79] text-[14px]">Untaxed Amount</span>
      <span className="text-[#303F58] text-[18px] font-bold">Rs 0.00</span>
    </div>
    <div className="flex justify-between w-full mb-1">
      <span className="text-[#4B5C79] text-[14px]">SGST</span>
      <span className="text-[#4B5C79] text-[14px]">Rs 0.00</span>
    </div>
    <div className="flex justify-between w-full mb-1">
      <span className="text-[#4B5C79] text-[14px]">CGST</span>
      <span className="text-[#4B5C79] text-[14px]">Rs 0.00</span>
    </div>
    <div className="flex justify-between w-full mb-3">
      <span className="text-[#0B1320] text-[16px] font-bold">Total</span>
      <span className="text-[#303F58] text-[18px] font-bold">Rs 0.00</span>
    </div>    

    <div className="flex justify-center w-full space-x-2 mt-3 ms-24">
    <Link to={'/creditnote'}>
      <button className="bg-[#FEFDFA] text-[#565148] text-[14px] py-2 px-3 border border-[#565148] rounded-lg">
        Cancel
      </button>
      </Link>
      <button className="bg-[#FEFDFA] text-[#565148] text-[14px] py-2 px-3 border border-[#565148] flex items-center rounded-lg">
        <img src={printer} className="mr-1" alt="Print" />
        Print
      </button>
      <button className="bg-[#820000] text-white text-[14px] py-2 px-4 rounded-lg">
        Save
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default AddCreditNote;
