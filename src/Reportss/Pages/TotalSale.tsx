// import shopping from '../../assets/images/Group 2506.png'
// import packing from '../../assets/images/Group 2507.png'
// import processing from '../../assets//images/Group 2508.png'
//import delivery from '../../assets/images/Group 2509.png'

import total from "../../assets/images/Group 2501.png"
import foc from "../../assets/images/Group 2500.png"
import cash from "../../assets/images/Group 2499.png"
import credit from "../../assets/images/Group 2498.png"

import printer from '../../assets/images/printer.svg'
import split from '../../assets/images/list-filter.svg'


import search from '../../assets/images/search.svg'

const TotalSale: React.FC = () => {
  return (
<div>
<div className="flex min-h-screen w-full">

      <div>
        <div className="p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">Total Sale</h3>
              <p className='text-[#4B5C79]' >Lorem ipsum dolor sit amet consectetur </p>           
            </div>
            <div className="flex justify-between">
              <button
                
                className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md"
              >
                <img  alt="" />
                <p>Export As</p>
              </button>
              
            </div>
          </div>
          {/* Cards Section */}
          <div className="grid grid-cols-5 gap-5 my-2">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={total} className="h-[45px] w-[45px] " alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Total Cash Sale</div>  
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit  </p>           
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">120</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={total} className="h-[45px] w-[45px] " alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Total Credit Sale</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit </p>           

              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">100</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={foc} className="h-[45px] w-[45px] " alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Total Coupon Sale</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit  </p>           
              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">10</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={cash} className="h-[45px] w-[45px] "  alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Total Sale</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit </p>           
              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">12</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={credit} className="h-[45px] w-[45px] "  alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Total Collection</div>
              <p className='text-[#4B5C79] w-[400] text-[12]' >Lorem ipsum dolor sit</p>           
              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">12</div>
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
                placeholder="Search Total Sale"
                 
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
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Sales Man</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Cash Sale</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Credit Sale</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Coupon Sale</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Total Sale</th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">Credit Collection</th>

               </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">Subi</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">10</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">29</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">30</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>

                 
                </tr>

                <tr className="border-b">
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">2</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">jinu</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">20</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">25</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">34</td>
                  <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>

                 
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</div>
  );
};
 
export default TotalSale;