import printer from '../../assets/images/printer.svg'
import split from '../../assets/images/list-filter.svg'
import search from "../../assets/images/search.svg"
import plus from "../../assets/circle-plus.svg";
import { Link } from 'react-router-dom';


const PurchaseOrder: React.FC = () => {
  return (
<div>

<div className="flex justify-between items-center p-2">
        <div >
          <h3 className="text-[#303F58] text-[20px]  font-bold">Purchase Order</h3>
          <p className='text-[#4B5C79] m' >Lorem ipsum dolor sit amet consectetur </p>           
        </div>
        <div className="flex justify-between">
        <Link to={'/addpurchaseorder'}>
        <button
                
                className="flex justify-between items-center gap-2 bg-[#820000] text-white  px-5 py-2 rounded-md"
              >
                <img src={plus} alt="" />
                <p>New Purchase Order </p>
              </button></Link>
          
        </div>
</div>

    {/* Table Section */}
    <div className="bg-white shadow-md rounded-lg p-6 mx-3 my-2">
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
                placeholder="Search Purchase Order"
                 
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
                <th className="p-2 text-[12px] text-center text-[#303F58] w-16"> <input type="checkbox" /></th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Serial No</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Date</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Number</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Vendor Name</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Status</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Amount</th>


               </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">15 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">15 may 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1231</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">abcd</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    <span className="text-red-900 bg-[#E3E6D5] px-5 py-1 rounded-3xl">Billed</span>
         </td>
                           <td className="p-2 text-[14] text-center text-[#4B5C79]">60.00</td>
                 
                 
                </tr>

                <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">16 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">16 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">12312</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">abcde</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">
                    <span className="text-red-900 bg-[#E3E6D5] px-5 py-1 rounded-3xl">Billed</span>
         </td>
                           <td className="p-2 text-[14] text-center text-[#4B5C79]">60.00</td>
                 
                  

                 
                </tr>
                
              </tbody>
            </table>
</div>


</div>
  );
};
 
export default PurchaseOrder;