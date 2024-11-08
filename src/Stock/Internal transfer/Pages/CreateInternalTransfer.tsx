import printer from '../../../assets/images/printer.svg'
import split from '../../../assets/images/list-filter.svg'
import search from "../../../assets/images/search.svg"


// import plus from '../../../assets/circle-plus.svg'
import { Link } from 'react-router-dom';
 
const CreateInternalTransfer: React.FC = () => {
  return (
<div>



<div className="flex justify-between items-center my-2">
            <div>
              <h1 className="text-xl ml-2 font-bold">Internal Transfer</h1>
              <p className='text-gray-500 ms-2 my-2'>Lorem ipsum dolor sit amet</p>
            </div>
            <div className="flex justify-between">
             <Link to={'/addinternaltransfer'}>
             
             </Link>
              
              
             
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
                <th className="p-2 text-[12px] text-center text-[#303F58] w-16"> <input type="checkbox" /></th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Sl No</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Date</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Transfer No</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Frome Route</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">To Route</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Stock</th>

               </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">15 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">IN-44</td>
                 
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Kakka</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">patta</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">89</td>
                 
                </tr>
                
              </tbody>

              <tbody>
                <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">2</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">15 May 2023</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">IN-44</td>
               
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Kaooa</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">pala</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">44</td>
                 
                </tr>
                
              </tbody>



            </table>
          </div>




</div>
  );
};
 
export default CreateInternalTransfer;