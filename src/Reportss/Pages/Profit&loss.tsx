
const ProfitLoss: React.FC = () => {
  return (
    <div className="w-full   bg-white shadow-xl my-3 rounded-lg">
         {/* Header Section */}
    <div className="flex justify-between items-center pt-3 mx-4">
      <div >
        <h3 className="text-[#303F58] text-[20px]  font-bold">Profit and Loss</h3>
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
    <div className="  mx-20   ">
      <h1 className="text-2xl font-bold text-center mb-1">Life Water</h1>
      <h2 className="text-xl font-semibold text-center mb-2">Profit and Loss</h2>

      {/* Depreciation Section */}

      <div className="mb-3 mx-10">
        <h3 className="text-lg font-semibold mb-2">Depreciation</h3>
        <div className="border-t border-gray-300">
          <div className="flex justify-between py-2">
            <span className="font-bold">LIABILITY</span>
            <span className="font-bold">AMOUNT</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Sales</span>
            <span>775</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Purchases</span>
            <span>383.85673492</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Discount</span>
            <span>0</span>
          </div>
        </div>
      </div>

      {/* GST Profit */}
      <div className="mb-3 mx-10">
        <div className="flex justify-between border-t border-gray-300 py-3 font-bold">
          <span>GST PROFIT</span>
          <span>383.85673492</span>
        </div>
      </div>

      {/* Costs Section */}
      <div className="mb-3 mx-10">
        <div className="border-t border-gray-300">
          <div className="flex justify-between py-2">
            <span>Staff Cost</span>
            <span>0</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Operation Exp</span>
            <span>0</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Depreciation</span>
            <span>0</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Tax</span>
            <span>0</span>
          </div>
        </div>
      </div>

      {/* Net Earnings */}
      <div className="flex justify-between border-t border-gray-300 pt-3 pb-14 mx-10  font-bold ">
        <span>NET EARNING</span>
        <span>383.85673492</span>
      </div>
    </div>
    </div>
    
  );
};

export default ProfitLoss;
