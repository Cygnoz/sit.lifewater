import shopping from "../../../assets/images/Group 2506.png";
import packing from "../../../assets/images/Group 2507.png";
import processing from "../../../assets//images/Group 2508.png";
import delivery from "../../../assets/images/Group 2509.png";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Cards from "../../../commoncomponents/HomePageCards/Cards";
import Button from "../../../commoncomponents/Buttons/Button";
import PlusIcon from "../../../assets/icons/PlusIcon";
import Table from "../../../commoncomponents/Table/Table";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";


const StockLoaded: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [stockload, setStockload] = useState<any[]>([]);
  const { loading , setLoading } = useContext(TableResponseContext)!;
  const { request:getStockData } = useApi("get", 5005);


  const [columns] = useState([
    { id: "Date", label: "date", visible: true },
    { id: "transferNo", label: "Transfer No", visible: true },
    { id: "stock", label: "Stock", visible: true },
    { id: "mailroute", label: "Main Route", visible: true },
   
  ]);

  const getStock = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endpoints.GET_ALL_CUSTOMERS}`;
      const { response, error } = await getStockData(url);

      if (!error && response) {
        setStockload(response.data);
        setLoading({ ...loading, skeleton: false });
      } else {
        console.log(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getStock();
  }, []);

const stockData = [
  {
    imgSrc: shopping,
    title: "Total Stock Load",
    description: "Total number of stock items loaded this month",
    value: 120,
  },
  {
    imgSrc: packing,
    title: "Today Stock Loaded",
    description: "Number of stock items loaded today",
    value: 100,
  },
  {
    imgSrc: processing,
    title: "Week Stock Loaded",
    description: "Total number of stock items loaded this week",
    value: 10,
  },
  {
    imgSrc: delivery,
    title: "This Month",
    description: "Total number of stock items loaded in the current month",
    value: 12,
  },
];

  

  
  return (
    <div>
      <div className=" min-h-screen w-full mt-2">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[#303F58] text-[20px] font-bold">
                  Stock Loaded
                </h3>
                <p className="text-[#4B5C79] text-sm">
                View detailed information about all stock items loaded across various periods{" "}
                </p>
              </div>
              <div className="flex justify-between">
                <Link to={'/addstockloaded'}>
                <Button variant="primary" size="sm">
                  <PlusIcon color="white"/>
                  <p>Add New Stock</p>
                </Button>
                </Link>
                
              </div>
            </div>
            {/* Cards Section */}
            <div className="grid grid-cols-4 gap-4 ">
        {stockload.map((card, index) => (
          <Cards
            key={index}
            imageSrc={card.imgSrc}
            title={card.title}
            description={card.description}
            count={card.value}
            isActive={activeCardIndex === index}
            onCardClick={() => setActiveCardIndex(index)}
          />
        ))}
      </div>

      <div className="bg-white p-5 mt-5 rounded-lg">
        <Table
          columns={columns}
          data={stockData}
          searchPlaceholder={"Search Stock"}
          loading={false}
          searchableFields={["transferNo"]}
        />
      </div>
          </div>
      </div>
  );
};

export default StockLoaded;
