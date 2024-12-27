import { useNavigate } from "react-router-dom";

import plus from "../../assets/circle-plus.svg";
import { useContext, useEffect, useState } from "react";
import { TableResponseContext } from "../../assets/Context/ContextShare"
import Table from "../../commoncomponents/Table/Table"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";

// interface Route {
//   id: string;
//   _id: string;
//   mainRoute: string;
//   subrouteCode: string;
//   subRoute: string;
//   description: string;
// }

type Props = {};

function SubRoute({}: Props) {

  const { loading, setLoading } = useContext(TableResponseContext)!
  const [subRoutes,setSubRoutes] = useState<any[]>([])

  const { request: getSubRoutes } = useApi("get", 4000)
  const getALLSubroute = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false })
      const url = `${endpoints.GET_ALL_SUBROUTE}`
      const { response, error } = await getSubRoutes(url)
      console.log("API RESPONSE :",response)

      if (!error && response) {
        setLoading(false)
        setSubRoutes(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getALLSubroute()
  }, [])

  const [columns] = useState([
    { id: "subRouteName", label: "Sub Route", visible: true },
    { id: "subrouteCode", label: "Subroute Code", visible: true },
    { id: "description", label: "Description", visible: true },
    { id: "mainRouteName", label: "Main Route", visible: true },
  ]);

  const { request: deleteRoute } = useApi("delete", 4000);

  const handleDelete =async (id:string) => {
    try{
      const url =`${endpoints.DELETE_A_SUBROUTE}/${id}`;
      const { response, error } = await deleteRoute(url);
      getALLSubroute()
      if(!error && response){
        toast.success(response?.data.message);
      }
      console.log(response);
    }catch (error) {
      toast.error("Error occurred while deleting route.");
    }
  }

  const navigate = useNavigate();

  const handleCreate = (): void => {
    navigate("/route/newsubroute");
  };

  const handleEdit = (id: string): void => {
    navigate(`/route/editsubroute/${id}`);
  };

  const handleView = (id: string): void => {
    navigate(`/route/viewsubroute/${id}`);
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

      <div className="flex justify-between items-center my-2">
        <div className="  mx-2">
          <h3 className="text-[#303F58] text-[20px] font-bold">
            Create Sub Route
          </h3>
          
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleCreate}
            className="flex justify-between items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md"
          >
            <img src={plus} alt="" />
            <p>Add New Sub Route</p>
          </button>
          
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-5 mt-5 rounded-lg">
        <Table 
          columns={columns} 
          data={subRoutes} 
          searchPlaceholder="Search Route" 
          loading={loading.skeleton} 
          searchableFields={[ "subRouteName", "subrouteCode"]}
          onViewClick={handleView} // Add this prop
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
      </div>

    </div>
  );
}

export default SubRoute;
