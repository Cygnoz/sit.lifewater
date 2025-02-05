
import { Link } from "react-router-dom";
import AddNewButton from "../../../commoncomponents/Buttons/AddNewButton";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
import { useContext, useEffect, useState } from "react";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import Table from "../../../commoncomponents/Table/Table";

const CreateInternalTransfer: React.FC = () => {

  const { request: getAllTransfer } = useApi("get", 4001);
  const [allTransfer, setAllTransfer] = useState<any[]>([]);
  const { loading, setLoading } = useContext(TableResponseContext)!;

  const [columns] = useState([
    { id: "date", label: "Date", visible: true },
    { id: "transferNumber", label: "Transfer No", visible: true },
    { id: "fromRoute", label: "From Route", visible: true },
    { id: "toRoute", label: "To Route", visible: true },
    { id: "filledBottlesTransferred", label: "Bottles", visible: true },

  ]);

  const getTransfer = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false })

      const url = `${endpoints.GET_INTERNAL_TRANSFER}`;
      const { response, error } = await getAllTransfer(url);
      if (!error && response) {
        setAllTransfer(response.data)
        console.log(response.data, "transfer");
        setLoading({ ...loading, skeleton: false })

      } else {
        console.log(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true })
      }
    } catch (error) {
      console.log(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true })
    }
  }

  useEffect(() => {
    getTransfer()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <div>
          <h1 className="text-[#303F58] text-[20px] font-bold">Internal Transfer</h1>
          <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet</p>

        </div>
        <div className="flex justify-between">
          <Link to={"/addinternaltransfer"}>
            <AddNewButton>
              Add New Transfer
            </AddNewButton>
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
          searchableFields={["transferNumber", "fromRoute","toRoute"]}
          showAction={false} // Explicitly disable the action column
        />
      </div>

    </div>
  );
};

export default CreateInternalTransfer;
