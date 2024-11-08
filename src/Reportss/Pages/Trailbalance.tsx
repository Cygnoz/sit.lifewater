

import search from "../../assets/images/search.svg";
const TrailBalance: React.FC = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start my-2 mx-2">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Trial Balance</h3>
          <p className="text-[#4B5C79]">
            Lorem ipsum dolor sit amet consectetur{" "}
          </p>
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
            placeholder="Search Trail Balance"
          />
          <div className="flex w-[60%] justify-end">
            <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
              Sort By
            </button>
            
          </div>
        </div>
        <table className="w-full text-left">
          <thead className=" bg-[#fdf8f0]">
            <tr className="border-b">
              <th className="p-2 text-[12px] text-center text-[#303F58]">
               Sl No
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Account Name
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Account Type
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Account Head
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Debit
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
               Credit
              </th>
              <th className="p-2 text-[12px] text-center text-[#303F58]">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 text-[14] text-center text-[#4B5C79]">1</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">john</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">22</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">22</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">89</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">22</td>
              <td className="p-2 text-[14] text-center text-[#4B5C79]">22</td>

            
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrailBalance;
