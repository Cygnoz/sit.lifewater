import { Link } from "react-router-dom";
import AddNewButton from "../../../commoncomponents/Buttons/AddNewButton";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
import { useContext, useEffect, useState } from "react";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import Table from "../../../commoncomponents/Table/Table";
import { toast, ToastContainer } from "react-toastify";

const CreateInternalTransfer: React.FC = () => {
  const { request: getAllTransfer } = useApi("get", 4001);
  const [allTransfer, setAllTransfer] = useState<any[]>([]);
  const { loading, setLoading } = useContext(TableResponseContext)!;

  const [columns] = useState([
    { id: "date", label: "Date", visible: true },
    { id: "time", label: "Time", visible: true },
    { id: "transferNumber", label: "Transfer No", visible: true },
    { id: "fromRoute", label: "From Route", visible: true },
    { id: "toRoute", label: "To Route", visible: true },
    { id: "filledBottlesTransferred", label: "Bottles", visible: true },
  ]);

  const getTransfer = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = endpoints.GET_INTERNAL_TRANSFER;
      console.log("Fetching Internal Transfer from:", url);

      const { response, error } = await getAllTransfer(url);

      if (error) {
        console.error("API Error:", error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      } else if (response) {
        console.log("Fetched Transfers:", response.data);

        // Transform data to separate date and time
        const formattedTransfers = response.data.map((transfer: any) => {
          const timestamp = new Date(transfer.date);
          return {
            ...transfer,
            date: timestamp.toLocaleDateString(), // Extract date
            time: timestamp.toLocaleTimeString(), // Extract time
          };
        });

        setAllTransfer(formattedTransfers);
        setLoading({ ...loading, skeleton: false });
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getTransfer();
  }, []);

  const { request: deleteItem } = useApi("delete", 4001);

    const handleDelete = async (id: string) => {
      try {
        const url = `${endpoints.DELETE_INTERNAL_TRANSFER}/${id}`;
        const { response, error } = await deleteItem(url);
        if (!error && response) {
          toast.success(response.data.message);
          getTransfer(); // Refresh the list
        }else {
          toast.error(error?.response?.data?.message || "An error occurred");
        }
      } catch (error) {
        toast.error("Error occurred while deleting the item.");
      }
    };

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div>
          <h1 className="text-[#303F58] text-[20px] font-bold">Internal Transfer</h1>
          <p className="text-[#4B5C79]">Manage all internal transfers</p>
        </div>
        <div className="flex justify-between">
          <Link to={"/addinternaltransfer"}>
            <AddNewButton>Add New Transfer</AddNewButton>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <Table
          columns={columns}
          data={allTransfer}
          searchPlaceholder={"Search Transfer"}
          loading={loading.skeleton}
          searchableFields={["transferNumber", "fromRoute", "toRoute"]}
          showAction={true} // Explicitly disable the action column
          onDeleteClick={handleDelete}
        />
      </div>
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
    </div>
  );
};

export default CreateInternalTransfer;
