
const BalanceSheet: React.FC = () => {
    return (
      <div className="w-full   bg-white shadow-xl my-3 pb-14 rounded-lg">
           {/* Header Section */}
      <div className="flex justify-between items-center  pt-3 mx-4">
        <div >
          <h3 className="text-[#303F58] text-[20px]  font-bold">Balance Sheet</h3>
          <p className='text-[#4B5C79] m' >Lorem ipsum dolor sit amet consectetur </p>           
        </div>
        <div className="flex justify-between">
          <button
            

            className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md"
          >
            
            <p>Export As</p>
          </button>
          
        </div>
      </div>
      <div className="  mx-20   shadow-xl rounded mt-5 pb-5">
        <h1 className="text-2xl font-bold text-center mb-1">Life Water</h1>
        <h2 className="text-xl font-semibold text-center mb-2">Balance Sheet</h2>
  
        {/* Depreciation Section */}
        <div className=" p-4  ">
        
        <table className="w-full mb-10 text-left mt-4 ">
          <thead className="border">
            <tr className="">
              <th className="p-2 text-[12px]   text-center text-[#303F58]">
              LIABILTY
              </th>
              <th className="p-2 text-[12px]  text-center text-[#303F58]">
                AMOUNT
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                ASSET 
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                AMOUNT
              </th>
             
            </tr>
          </thead>
          <tbody>
            <tr className="border">
              <td className="p-4 text-[14] text-center font-bold text-[#4B5C79]">fixed Liability</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">10</td>
              <td className="p-4 text-[14] text-center font-bold text-[#4B5C79]">Fixed Asset</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">22</td>
              
            
            </tr>
            <tr className="border">
              <td className="p-4 text-[14] text-center font-bold text-[#4B5C79]">Current Liability</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">10</td>
              <td className="p-4 text-[14] text-center font-bold text-[#4B5C79]">Current Asset</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">22</td>
              
            
            </tr><tr className="border">
              <td className="p-4 text-[14] text-center text-[#4B5C79]">Supply</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">10</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">Inventory</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">22</td>
              
            
            </tr>
            <tr className="border">
              <td className="p-4 text-[14] text-center text-[#4B5C79]">Earnings</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">10</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">lorem</td>
              <td className="p-4 text-[14] text-center text-[#4B5C79]">22</td>
              
            
            </tr><tr className="border">
              <td className="p-4 text-[14] font-bold text-center text-[#4B5C79]">Total</td>
              <td className="p-4 text-[14] font-bold text-center text-[#4B5C79]">10</td>
              <td className="p-4 text-[14] font-bold text-center text-[#4B5C79]">Total</td>
              <td className="p-4 text-[14] font-bold text-center text-[#4B5C79]">22</td>
              
            
            </tr>
          </tbody>
        </table>
      </div>
        
      </div>
      </div>
      
    );
  };
  
  export default BalanceSheet;
  