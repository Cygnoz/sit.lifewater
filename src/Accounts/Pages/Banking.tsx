// import printer from "../../assets/images/printer.svg";
// import split from "../../assets/images/list-filter.svg";

import plus from "../../assets/circle-plus.svg";
import plusbank from "../../assets/images/circle-plus banking.svg";

// import dot from "../../assets/ellipsis-vertical.svg";
// import search from "../../assets/images/search.svg";
const Banking: React.FC = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start my-2 mx-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Banking</h3>
          <p className="text-[#4B5C79]">
            Lorem ipsum dolor sit amet consectetur
          </p>
        </div>
        <div className="flex justify-between">
          <button className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md">
            <img src={plus} alt="" />
            <p>Add New</p>
          </button>
        </div>
      </div>
      <div className="h-16 px-6 py-4 bg-gradient-to-r flex justify-between from-[#ffe3b8] to-[#fff3d4] rounded-lg my-3 items-start gap-4 w-full">
        <div>
          <h3 className="text-[#303F58] text-[16px] mt-1   font-bold">
            Petty Cash
          </h3>
        </div>
        <div className="flex justify-between">
          <button className="justify-between items-center h-[32px] gap-2 text-[12px] bg-[#FEFDFA] text-[#565148] flex px-5 py-2 rounded-md border font-semibold border-[#565148]">
            <img className="text-[#565148]  " src={plusbank} alt="" />
            <p>New Bank or Card</p>
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 flex ">
        <div className=" bg-[#E3E6D5] py-3 rounded-xl h-auto px-4">
          <div className="flex justify-between items-center space-x-10 w-[251px] py-1 bg-white rounded px-2">
            <h1>Account Name</h1>
            <h1>Balance</h1>
          </div>
          <div className="flex justify-between items-center px-3 py-2 space-x-4">
            <h1>bob</h1>
            <h1>0.00</h1>
          </div>
          <div className="flex justify-between px-3 py-2 items-center space-x-4">
            <h1>bob</h1>
            <h1>0.00</h1>
          </div>
        </div>
        {/* Table Section */}
        <table className="w-full mx-3 text-left ">
          <thead className=" bg-[#fdf8f0]">
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Date{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Inv No{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Reference{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Type{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Description{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Debit{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Credit{" "}
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Balance{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2  text-[14] text-center  text-[#4B5C79]">
                10-09-2013
              </td>
              <td className="p-2  text-[14] text-center  text-[#4B5C79]">
                1784
              </td>

              <td className="p-2 text-[14] text-center text-[#4B5C79]">1234</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">
                Lorem
              </td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">
                Lorem ituu
              </td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banking;
