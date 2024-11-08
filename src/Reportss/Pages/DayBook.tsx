

import printer from '../../assets/images/printer.svg'
import split from '../../assets/images/list-filter.svg'


import search from '../../assets/images/search.svg'

const DayBook: React.FC = () => {
  return (
<div className='p-2'>
<div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">Day Book</h3>
              <p className='text-[#4B5C79]' >Lorem ipsum dolor sit amet consectetur </p>           
            </div>
            <div className="flex justify-between">
             
              
            </div>
          </div>

    {/* Table Section */}
    <div className="bg-white shadow-md rounded-lg my-2 p-4">
          <div className="flex justify-between items-center mb-4">
              <div className="absolute ml-3 ">
                <img src={search} alt="search" className="h-5 w-5" />
              </div>
              <input
                className="pl-9 text-sm w-[100%] rounded-md text-start text-gray-800 h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400"
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.04)",
                  outline: "none",
                  boxShadow: "none",
                }}
                placeholder="Search Stock"
                 
              />
              <div className="flex w-[60%] justify-end">
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                  <img className="mt-1 me-1" src={split} alt="" />
                  Sort By
                </button>
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
                  <img className="mt-1 me-1" src={printer} alt="" />
                  Print
                </button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className=' bg-[#fdf8f0]'>
                <tr className="border-b">
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Date</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Vehicle Number</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Account Name</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Sub Leger</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Account Type</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Vehicle Type</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Description</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Debit</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Credit</th>

               </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">15 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">bill-1</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">sales</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Gallon Bottle</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Current Liability</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Purchase</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]"></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">200</td>
                 
                </tr>

                <tr className="border-b">
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">2</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">18 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">bill-2</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">sales</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">5 Gallon Bottles</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Current Asset</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Sale</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]"></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">200</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
                 
                </tr>
                
              </tbody>
            </table>
          </div>

</div>
  );
};
 
export default DayBook;