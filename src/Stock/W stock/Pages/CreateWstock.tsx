import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
import AddNewButton from "../../../commoncomponents/Buttons/AddNewButton";
import PurchaseTable from "../../../commoncomponents/Table/Table";


interface StockData {
  _id: string;
  warehouse: string;
  date: string;
  transferNumber: number;
  items: Array<{
    itemName: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

const CreateWStock: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  const { request: getWStockData } = useApi("get", 4001);

  const fetchWarehouseStock = async () => {
    try {
      const url = `${endpoints.GET_W_STOCK}`;
      const { response, error } = await getWStockData(url);
      if (!error && response) {
        setStocks(response.data.data);
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouseStock();
  }, []);

  const columns = [
    { id: "date", label: "Date", visible: true },
    { id: "items", label: "Items", visible: true },
    { id: "warehouse", label: "Warehouse", visible: true },
    { id: "transferNumber", label: "Transfer Number", visible: true },
  ];

  const renderColumnContent = (colId: any, stock: any) => {
    switch (colId) {
      case "slNo":
        return stocks.indexOf(stock) + 1;
      case "date":
        return stock.date.split("T")[0];
      case "items":
        return (
          <div>
            {stock.items.map((item : any, idx :any) => (
              <div key={idx}>{item.itemName}</div>
            ))}
          </div>
        );
      case "warehouse":
        return stock.warehouse;
      case "transferNumber":
        return stock.transferNumber;
      default:
        return "-";
    }
  };

  return (
    <div>
      <div className="flex min-h-screen w-full">
        <div className="p-2 w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">
                Create W-Stock
              </h3>
              <p className="text-[#4B5C79]">
                Manage your warehouse stock efficiently.
              </p>
            </div>
            <div className="flex">
              <Link to={"/addWstock"}>
                <AddNewButton>Add New Stock</AddNewButton>
              </Link>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg p-6 my-2">
            <PurchaseTable
              columns={columns}
              data={stocks}
              loading={loading}
              searchPlaceholder="Search Stock"
              searchableFields={["warehouse", "transferNumber","date"]}
              renderColumnContent={renderColumnContent}
              showAction={false}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWStock;
