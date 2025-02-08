import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Button from "../../../commoncomponents/Buttons/Button";
import PlusIcon from "../../../assets/icons/PlusIcon";
import Table from "../../../commoncomponents/Table/Table";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";
import { toast, ToastContainer } from "react-toastify";

const StockLoaded: React.FC = () => {
  const [stockload, setStockload] = useState<any[]>([]);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getStockData } = useApi("get", 4001);
  const { request: deleteItem } = useApi("delete", 4001);

  const [columns] = useState([
    { id: "date", label: "Date", visible: true },
    { id: "transferNumber", label: "Transfer No", visible: true },
    { id: "mainRouteName", label: "Main Route", visible: true },
    { id: "subRouteName", label: "Sub Route", visible: true },
  ]);

  // Fetch Stock Data
  const getStock = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });
      const url = `${endpoints.GET_ALL_LOADED_STOCK}`;
      const { response, error } = await getStockData(url);

      if (!error && response) {
        const formattedData = response.data
          .map((item: any) => {
            if (!item._id) {
              console.error("Error: Missing _id field in stock item", item);
              return null;
            }
            return {
              _id: item._id,
              date: new Date(item.date).toLocaleDateString(),
              transferNumber: item.transferNumber,
              stock: item.stock
                .map(
                  (stockItem: any) =>
                    `${stockItem.itemName} (${stockItem.quantity})`
                )
                .join(", "),
              mainRouteName: item.mainRouteName,
              subRouteName: item.subRouteName,
              warehouseName: item.warehouseName,
            };
          })
          .filter(Boolean);

        setStockload(formattedData);
        setLoading({
          ...loading,
          skeleton: false,
          noDataFound: formattedData.length === 0,
        });

        console.log("All Loaded stock:", formattedData);
      } else {
        console.error("Error fetching stock data:", error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getStock();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Error: Stock ID is undefined", id);
      toast.error("Invalid Stock ID");
      return;
    }

    
    console.log("Deleting Stock with ID:", id);
    try {
      const url = `${endpoints.DELETE_STOCK_LOAD}/${id}`;
      const { response, error } = await deleteItem(url);

      if (!error && response) {
        toast.success(response.data.message);
        getStock(); // Refresh the list
      } else {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("Error occurred while deleting the item.");
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <div>
      <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
      <div className="min-h-screen w-full p-2">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[#303F58] text-[20px] font-bold">
              Stock Loaded
            </h3>
            <p className="text-[#4B5C79]">
              View detailed information about all stock items loaded across
              various periods
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

        {/* Table Section */}
        <div className="bg-white p-5 mt-2 rounded-lg">
          <Table
            columns={columns}
            data={stockload}
            searchPlaceholder={"Search Transfer"}
            loading={loading.skeleton}
            searchableFields={[
              "transferNumber",
              "mainRouteName",
              "subRouteName",
            ]}
            showAction={true}
            onDeleteClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default StockLoaded;
