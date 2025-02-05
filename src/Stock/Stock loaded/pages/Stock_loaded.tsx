import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Button from "../../../commoncomponents/Buttons/Button";
import PlusIcon from "../../../assets/icons/PlusIcon";
import Table from "../../../commoncomponents/Table/Table";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";



const StockLoaded: React.FC = () => {
  const [stockload, setStockload] = useState<any[]>([]);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getStockData } = useApi("get", 4001);

  const [columns] = useState([
    { id: "date", label: "Date", visible: true },
    { id: "transferNumber", label: "Transfer No", visible: true },
    { id: "mainRouteName", label: "Main Route", visible: true },
    { id: "subRouteName", label: "Sub Route", visible: true },

  ]);

  const getStock = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endpoints.GET_ALL_LOADED_STOCK}`;
      const { response, error } = await getStockData(url);

      if (!error && response) {
        // Transform response data for table
        const formattedData = response.data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString(),
          transferNumber: item.transferNumber,
          stock: item.stock
            .map((stockItem: any) => `${stockItem.itemName} (${stockItem.quantity})`)
            .join(", "),
          mainRouteName: item.mainRouteName,
          subRouteName: item.subRouteName,
          warehouseName: item.warehouseName,
        }));

        setStockload(formattedData);
        console.log("All Loaded stock:", formattedData);

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

  return (
    <div>
      <div className="min-h-screen w-full p-2 ">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[#303F58] text-[20px] font-bold">Stock Loaded</h3>
            <p className="text-[#4B5C79] ">
              View detailed information about all stock items loaded across various periods{" "}
            </p>

          </div>
          <div className="flex justify-between">
            <Link to={"/addstockloaded"}>
              <Button variant="primary" size="sm">
                <PlusIcon color="white" />
                <p>Add New Stock</p>
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-white p-5 mt-2 rounded-lg">
          <Table
            columns={columns}
            data={stockload}
            searchPlaceholder={"Search Stock"}
            loading={loading.skeleton}
            searchableFields={["transferNumber", "mainRouteName"]}
            showAction={false} // Explicitly disable the action column
          />

        </div>
      </div>
    </div>
  );
};

export default StockLoaded;