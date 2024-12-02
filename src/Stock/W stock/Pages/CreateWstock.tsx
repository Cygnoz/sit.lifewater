import split from "../../../assets/images/list-filter.svg";
import search from "../../../assets/images/search.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
import AddNewButton from "../../../commoncomponents/Buttons/AddNewButton";
import PrintButton from "../../../commoncomponents/Buttons/PrintButton";
interface StockData {
  warehouse: string;
  date: string;
  transferNumber: number;
  items: Array<{
    itemName: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes: string;
  termsAndConditions: string;
}

const CreateWStock: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);

  const { request: getWStockData } = useApi("get", 4001);

  const getAllWarehouseSock = async ()=>{
    try{
      const url = `${endpoints.GET_W_STOCK}`;
      const { response, error } = await getWStockData(url);
      if(!error && response){
        setStocks(response.data.data);
        console.log(response.data.data);
      } else{
        console.log(error);
  
      }
    }catch(error){
      console.log(error);     
    }
  }
  useEffect(() => {
    getAllWarehouseSock()
  }, []);

  return (
    <div>
      <div className="flex min-h-screen w-full">
          <div className="p-2 w-full">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[#303F58] text-[20px] font-bold">
                  Create W-Stock{" "}
                </h3>
                <p className="text-[#4B5C79]">
                  Lorem ipsum dolor sit amet consectetur{" "}
                </p>
              </div>
              <div className="flex justify-between">  
                <Link to={"/addWstock"}>
                <AddNewButton  >
                Add New Stock
                </AddNewButton>
                </Link>           
              </div>
            </div>
            {/* Cards Section */}
            {/* <div className="grid grid-cols-4 gap-4 my-3">
              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={shopping} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  5 Gallon Bottle
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                  Lorem ipsum dolor sit amet consectetur{" "}
                </p>
                <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                  120
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={packing} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  Table Top
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                  Lorem ipsum dolor sit amet consectetur{" "}
                </p>

                <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">
                  100
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={processing} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  Water Dispenser
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                  Lorem ipsum dolor sit amet consectetur{" "}
                </p>
                <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">
                  10
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg">
                <img src={delivery} className="h-[45px] w-[45px] " alt="" />
                <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                  Water Pump
                </div>
                <p className="text-[#4B5C79] w-[400] text-[12]">
                  Lorem ipsum dolor sit amet consectetur{" "}
                </p>
                <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">
                  12
                </div>
              </div>
            </div> */}

            {/* Table Section */}
            <div className="bg-white shadow-md rounded-lg p-6  my-2">
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
                  <button className=" hidden border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                    <img className="mt-1 me-1" src={split} alt="" />
                    Sort By
                  </button>
                  <PrintButton></PrintButton>                 
                </div>
              </div>
              <table className="w-full text-left">
                <thead className=" bg-[#fdf8f0]">
                  <tr className="border-b">
                    
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Sl No
                    </th>
                    <th className="p-2 text-[12px] text-center w-[242px] text-[#303F58]">
                      Date
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      Items
                    </th>
                    <th className="p-2 w-[333px] text-[12px] text-center text-[#303F58]">
                      Warehouse
                    </th>
                    <th className="p-2 text-[12px] text-center text-[#303F58]">
                      TransferNumber
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, index) => (
                    <tr className="border-b">
                    
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {index +1}
                      </td>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {stock.date.split('T')[0]}
                      </td>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      {stock.items.map((item)=>(
                        item.itemName
                      ))}
                      </td>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {stock.warehouse}
                      </td>
                      <td className="p-2 text-[14] text-center text-[#4B5C79]">
                        {stock.transferNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default CreateWStock;
