

import printer from "../../assets/images/printer.svg"
import split from "../../assets/images/list-filter.svg"
import search from "../../assets/images/search.svg"
const CreditSale: React.FC = () => {
  return (
<div>

    {/* Header Section */}
    <div className="flex justify-between items-center my-2 mx-2">
      <div>
        <h3 className="text-[#303F58] text-[20px] font-bold">Credit Sale</h3>
        <p className='text-[#4B5C79]' >Lorem ipsum dolor sit amet consectetur </p>           
      </div>
      <div className="flex justify-between">
        <button
          
          className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md"
        >
          
          <p>Export As</p>
        </button>
        
      </div>
    </div>
{/* Table Section */}
<div className="bg-white shadow-md rounded-lg p-4">
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
                placeholder="Search Credit Sale"
                 
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
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Sales Man</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">AED10</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">AED5</th>

               </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Arju</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">89</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">22</td>
                 
                </tr>
                
              </tbody>
            </table>
          </div>
</div>
  );
};
 
export default CreditSale;