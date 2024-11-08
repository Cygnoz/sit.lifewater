import active from "../../assets/images/shopping-route.svg";
import total from "../../assets/images/processing.svg";
import totsub from "../../assets/images/packing_route.svg";
import publicc from "../../assets/images/public-service route.svg";
import printer from "../../assets/images/printer.svg";
import vector from "../../assets/images/Vector.svg";
import trash from "../../assets/images/trash.svg";
import split from "../../assets/images/list-filter.svg";
import plus from "../../assets/circle-plus.svg";
import eye from "../../assets/images/eye.svg";
// import dot from "../../assets/ellipsis-vertical.svg";
import { useNavigate } from "react-router-dom";
import { deleteRouteAPI, getRoutesAPI } from "../../services/RouteAPI/RouteAPI";
import { useEffect, useState ,useRef} from "react";
import search from "../../assets/images/search.svg"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 



interface Route {
  id: string;
  _id: string;
  mainRoute: string;
  routeCode: string;
  subRoute: string;
  description: string;
}

const CreateRoute: React.FC = () => {

  const [routesList, setRouteList] = useState<Route[]>([]); // Full route list
  const [filteredRouteList, setFilteredRouteList] = useState<Route[]>([]); // Filtered route list
 
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  console.log(filteredRouteList);
  

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await getRoutesAPI();
        console.log("Full API Response:", response); // Check the response
        setRouteList(response); // Store full staff list
        setFilteredRouteList(response) // Initially, display all route
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchRoute();
  }, []);

  useEffect(() => {
    const filtered = routesList.filter(route => 
      route.mainRoute.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRouteList(filtered);
  }, [searchQuery, routesList]);
  
  

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this route?");
    if (!confirmDelete) return;
  
    try {
      const response = await deleteRouteAPI(id);  // Pass the _id to the API function
      toast.success(response.message);  // Show success message
      setRouteList(routesList.filter((route) => route._id !== id));  // Update the UI
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("An error occurred while deleting the route.");
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
  const handleSub = ()  => {
    navigate('/route/subroute')
  };
 
  const tableRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    const printContent = tableRef.current;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
    }
  };

  

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
   
      <div>
        <div className="p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">
                Create Route
              </h3>
              <p className="text-[#4B5C79]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
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
          <div className="grid grid-cols-4 gap-4 my-6">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={active} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Active Route
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                
              </div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={total} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Total Route
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
               {routesList.length}
              </div>
            </div>

            <div onClick={handleSub} className="p-4 bg-white shadow-md rounded-lg">
              <img src={totsub} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Total Sub Route
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                20
              </div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={publicc} alt="" />
              <div className=" font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Total Customer
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className=" text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                12
              </div>
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
                placeholder="Search Route"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                 
              />
              <div className="flex w-[60%] justify-end">
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                  <img className="mt-1 me-1" src={split} alt="" />
                  Sort By
                </button>
                <button onClick={handlePrint} className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
                  <img className="mt-1 me-1" src={printer} alt="" />
                  Print
                </button>
              </div>
            </div>
           <div ref={tableRef}>
        
           <table className="print-table w-full text-left">
              <thead className="bg-[#fdf8f0]">
                <tr className="border-b">
                <th className="no-print p-2 text-[12px] text-center text-[#303F58] w-16"> <input type="checkbox" /></th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sl No
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Route
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Route Code
                  </th>
                  {/* <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sub Route
                  </th> */}
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Description
                  </th>
                  <th className="no-print p-2 text-[12px] text-center text-[#303F58]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRouteList.map((route, index) => (
                  <tr className="border-b" key={route.id}>
                    
                    <td className="no-print p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {index + 1}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {route.mainRoute}
                    </td>
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {route.routeCode}
                    </td>
                    {/* <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {route.subRoute}
                    </td> */}
                    <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                      {route.description}
                    </td>
                    <td className="no-print p-2 text-[14px] text-center text-[#4B5C79]">
                      <button
                        onClick={() => handleView(route._id)}
                        className="text-blue-500"
                      >
                        <img src={eye} alt="View" />
                      </button>
                      
                      <button onClick={() => handleEdit(route._id)} className="text-red-500 ml-2">
                        <img src={vector} alt="Edit" />
                      </button>
                      <button onClick={() => handleDelete(route._id)} className="text-red-500 ml-2">
                          <img src={trash} alt="Delete" />
                        </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default CreateRoute;