import rupee from '../assets/images/receipt-indian-rupee.svg';
import frame from '../assets/images/Frame 629279.svg'
import damage from '../assets/images/Frame 629278.svg'
import fram from '../assets/images/rupeeframe.svg'

const Stock: React.FC = () => {
    return (
        <div>

            <div className=" p-3 flex flex-col items-center justify-center bg-[#F5F6FA] pb-52">
                {/* Main Container */}
                <div className="w-full max-w-lg  p-4">

                    {/* Top Section: Stock balance, Damage Stock, Internal Order */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {/* Stock balance */}
                        <div className="bg-[#FFFFFF] shadow p-3 rounded-lg  flex flex-col ">
                            <span className=" rounded-full">
                                <img src={frame} alt="Icon" className="w-9 h-9" />
                            </span>
                            <span className="text-3xl font-bold text-[18px] text-left text-[#820000]">38</span>
                           
                            <span  className="text-[11px] font-bold leading-[13.31px] text-[#787A7D] text-left">Stock In Hand</span>
                        </div>
                        {/* Damage Stock */}
                        <div className="bg-[#FFFFFF] shadow p-3 rounded-lg flex flex-col ">
                            <span className="rounded-full">
                                <img src={damage} alt="Icon" className="w-9 h-9" />
                            </span>
                            <span className="text-3xl text-[18px] font-bold text-left text-[#820000]">00</span>
                            <span className="text-[11px] font-bold leading-[13.31px] text-left text-[#787A7D] ">Damage Stock</span>
                        </div>
                        {/* Internal Order */}
                        <div className="bg-[#FFFFFF] shadow p-3 rounded-lg flex flex-col ">
                            <span className="rounded-full">
                                <img src={fram} alt="Icon" className="w-9 h-9" />
                            </span>
                            <span className="text-3xl text-[18px] font-bold text-left text-[#820000]">00</span>
                            <span className="text-[11px] font-bold leading-[13.31px] text-left text-[#787A7D] ">Internal Order</span>
                        </div>
                    </div>

                    {/* Lower Section: Empty Stock, Advance Stock, Started Stock */}
                    <div className="space-y-4 bg-[#FFFFFF] rounded shadow p-5" >
                        {/* Empty Stock */}
                        <div className="bg-[#F5F6FA] p-2  rounded-lg flex items-center">
                            <div className=" w-10 h-10 flex justify-center items-center rounded-full mr-4">
                                {/* Icon placeholder */}

                                <span className="bg-[#E3E6D5] p-2 rounded-full">
                                    <img src={rupee} alt="Icon" className="w-6 h-6" />
                                </span>
                            </div>
                            <div className='text-left'>
                                <span className="text-[18px] font-bold text-left text-[#820000]">0</span>
                                <span className="block text-[14px] font-bold leading-[16.94px] text-[#787A7D]">Empty Stock</span>

                            </div>
                        </div>

                        {/* Advance Stock */}
                        <div className="bg-[#F5F6FA] p-2 rounded-lg flex items-center">
                            <div className="w-10 h-10 flex justify-center items-center rounded-full mr-4">
                                {/* Icon placeholder */}
                                <span className="bg-[#E3E6D5] p-2 rounded-full">
                                    <img src={rupee} alt="Icon" className="w-6 h-6" />
                                </span>
                            </div>
                            <div className='text-left'>
                                <span className="text-[18px] font-bold text-[#820000]">38</span>
                                <span className="block text-[14px] font-bold leading-[16.94px] text-center text-[#787A7D]">Advance Stock</span>

                            </div>
                        </div>

                        {/* Started Stock */}
                        <div className="bg-[#F5F6FA] p-2 rounded-lg flex items-center">
                            <div className="bg-gray-300 w-10 h-10 flex justify-center items-center rounded-full mr-4">
                                {/* Icon placeholder */}
                                <span className="bg-[#E3E6D5] p-2 rounded-full">
                                    <img src={rupee} alt="Icon" className="w-6 h-6" />
                                </span>
                            </div>
                            <div className='text-left'>
                                <span className="text-[18px] text-[#820000] font-bold ">38</span>
                                <span className="block text-[14px] font-bold leading-[16.94px] text-center text-[#787A7D]">Started Stock</span>

                            </div>

                            
                        </div>
                    </div>

                    <div className="mt-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <span className='text-[#787A7D]'>Others</span>
        </div>
      </div>


                </div>
            </div>

        </div>
    );
};

export default Stock;