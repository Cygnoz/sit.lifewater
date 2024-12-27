import plus from "../../assets/circle-plus.svg";

import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endpoints } from "../../services/ApiEndpoint";
import useApi from "../../Hook/UseApi";
import Table from "../../commoncomponents/Table/Table";
import { TableResponseContext } from "../../assets/Context/ContextShare";

const CreateRoute: React.FC = () => {
  const [routesList, setRouteList] = useState<any[]>([]); // Full route list
  const { loading, setLoading } = useContext(TableResponseContext)!;

  const [columns] = useState([
    { id: "mainRouteName", label: "Route", visible: true },
    { id: "mainRouteCode", label: "Subrout Code", visible: true },
    { id: "description", label: "Description", visible: true },
  ]);

  const { request: getmainroute } = useApi("get", 4000);

  const getALLMainroute = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });
      const url = `${endpoints.GET_ALL_MAINROUTE}`;
      const { response, error } = await getmainroute(url);
      console.log("API RESPONSE :", response);

      if (!error && response) {
        setLoading(false);
        setRouteList(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLMainroute();
  }, []);

  const { request: deleteMainRoute } = useApi("delete", 4000);

  const handleDelete = async (id: string) => {
    try {
      const url = `${endpoints.DELETE_A_MAINROUTE}/${id}`;
      const { response, error } = await deleteMainRoute(url);
      getALLMainroute();
      if (!error && response) {
        toast.success(response?.data.message);
      }
      console.log(response);
    } catch (error) {
      toast.error("Error occurred while deleting route.");
    }
  };

  const navigate = useNavigate();

  const handlecreate = (): void => {
    navigate("/route/createmainroute");
  };

  const handleView = (routeId: string): void => {
    navigate(`/route/viewroute/${routeId}`);
  };
  const handleEdit = (routeId: string): void => {
    navigate(`/route/editmainroute/${routeId}`);
  };

  // const tableRef = useRef<HTMLDivElement>(null);
  // const handlePrint = () => {
  //   const printContent = tableRef.current;
  //   const originalContent = document.body.innerHTML;
  //   if (printContent) {
  //     document.body.innerHTML = printContent.innerHTML;
  //     window.print();
  //     document.body.innerHTML = originalContent;
  //   }
  // };

  return (
    <>
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
        // optional CSS class for further styling
      />

      <div className="flex min-h-screen w-full">
        <div className="w-full ">
          <div className="p-2">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[#303F58] text-[20px] font-bold">
                  Create Main Route
                </h3>
                
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlecreate}
                  className="flex justify-between items-center gap-2 bg-[#820000] text-white  px-5 py-2 rounded-md"
                >
                  <img src={plus} alt="" />
                  <p>Add New </p>
                </button>
              </div>
            </div>
            {/* Cards Section */}
            <div className="grid grid-cols-4 gap-4 my-2"></div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <Table
                columns={columns}
                data={routesList}
                searchPlaceholder="Search Route"
                loading={loading.skeleton}
                searchableFields={["mainRouteName", "mainRouteCode"]}
                onViewClick={handleView} // Add this prop
                onEditClick={handleEdit}
                onDeleteClick={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoute;
