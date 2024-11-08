import printer from '../../assets/images/printer.svg'
import split from '../../assets/images/list-filter.svg'
import search from "../../assets/images/search.svg"
import plus from '../../assets/circle-plus.svg'
import { Link } from 'react-router-dom';



const Salesman: React.FC = () => {
  return (
<div>

<div className="flex justify-between items-center p-2">
        <div >
          <h3 className="text-[#303F58] text-[20px]  font-bold">Salesman S.dr</h3>
          <p className='text-[#4B5C79] m' >Lorem ipsum dolor sit amet consectetur commondo enim odio</p>           
        </div>
        <div className="flex justify-between">
        <Link to={'/addcollection'}>
        <button
          className="justify-between items-center gap-2 bg-[#820000] text-white flex px-4 py-2 rounded-md"
        >
          <img src={plus} alt="" />
          <p>Add New</p>
        </button>
        </Link>
       
      
       
          
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
                placeholder="Search salesman s.dr"
                 
              />
              <div className="flex w-[50%] justify-end">
                <button className="flex border text-[14] w-[500] text-[#565148] bg-[#FEFDFA] border-[#565148] px-4 py-2 me-2 rounded-lg">
                  <img className="mt-1 me-1" src={split} alt="" />
                  Sort By
                </button>
                <button className="flex border text-[14] w-[500] text-[#565148] bg-[#FEFDFA] border-[#565148] px-4 py-2 rounded-lg">
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
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Main Route</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Main Route</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Category</th>


               </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>

                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">12sep2024</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">TS-5</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">kakkanad</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">ernklm</td>
                  
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
                 
                </tr>

                <tr className="border-b">
                <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>

                  <td className="p-2 text-[14] text-center text-[#4B5C79]">2</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">12sep2024</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">TS-5</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">kochi</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">ernklm</td>
                  
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
                 
                </tr>

             
                
              </tbody>
            </table>
          </div>


</div>
  );
};
 
export default Salesman;