import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import back from "../../assets/images/backbutton.svg"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { endpoints } from "../../services/ApiEndpoint"
import useApi from "../../Hook/UseApi"

const EditSubRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>() // Get ID from URL params
  const [mainRoutes, setMainRoutes] = useState<MainRoute[]>([])
  // const [mainRoutes, setMainRoutes] = useState<{ mainRoute: string }[]>([]);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subRouteName: "",
    subrouteCode: "",
    mainRouteId: "", // This will store the selected mainRoute
    description: "",
  })
  const navigate = useNavigate()

  interface MainRoute {
    _id: string // Assuming the ID field is _id
    mainRouteName: string
  }
  console.log(loading);
  
  // interface Route {
  //   id: string;
  //   _id: string;
  //   mainRouteName: string;
  //   mainRouteCode: string;
  //   subRoute: string;
  //   description: string;
  // }

  // Fetch the subRoute data when the component mounts
  // useEffect(() => {
  //   const fetchSubRoute = async () => {
  //     try {
  //       const response = await axios.get(`${BASEURL}/getSRoute/${id}`);
  //       setFormData({
  //         subRouteName: response.data.subRoute || '',
  //         subrouteCode: response.data.subrouteCode || '',
  //         mainRoute: response.data.mainRoute || '',  // Ensure it gets initial value
  //         description: response.data.description || '',
  //       });
  //     } catch (error) {
  //       console.error('Error fetching subroute data', error);
  //       toast.error('Failed to load subroute data');
  //     }
  //   };

  //   fetchSubRoute();
  // }, [id]);

  const { request: getSubRoutes } = useApi("get", 4000)

  const getALLSubroute = async () => {
    try {
      const url = `${endpoints.view_A_SUBROUTE}/${id}`
      const { response, error } = await getSubRoutes(url)
      console.log("API RESPONSE :", response)

      if (!error && response) {
        setLoading(false)
        // setSubRoutes(response.data)
        setFormData({
          subRouteName: response.data.subRouteName || "",
          subrouteCode: response.data.subrouteCode || "",
          mainRouteId: response.data.mainRouteId || "", // Ensure it gets initial value
          description: response.data.description || "",
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getALLSubroute()
  }, [])



  const { request: getmainroute } = useApi("get", 4000)
  const getALLMainroute = async () => {
    try {
      const url = `${endpoints.GET_ALL_MAINROUTE}`
      const { response, error } = await getmainroute(url)
      console.log("API RESPONSE :", response)

      if (!error && response) {
        setLoading(false)
        setMainRoutes(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getALLMainroute()
  }, [])


  const { request: editSubRoute } = useApi("put", 4000)

  // Handle form submission to update the subRoute
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      if (!id) {
        toast.error("Invalid ID");
        return;
      }

  
      // Construct the API URL
      const url = `${endpoints.UPDATE_A_SUBROUTE}/${id}`;
  
      console.log("Submitting updated subroute data:", formData);
  
      // Call the API using the useApi `editSubRoute` request
      const { response, error } = await editSubRoute(url, formData);
  
      if (!error && response) {
        console.log("API Response:", response);
        toast.success("Subroute updated successfully!");
        setTimeout(()=>{
          navigate("/route/subroute"); // Redirect after successful edit
        },1000)
      } else {
        toast.error("Failed to update subroute. Please check the data.");
      }
    } catch (error) {
      console.error("Error while updating subroute:", error);
      toast.error("An error occurred while updating the subroute.");
    }
  };
  
  // Handle input changes, including the select dropdown for mainRoute
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="flex gap-4 items-center w-full max-w-8xl mb-6">
        <Link to={"/route/subroute"}>
          <div className="icon-placeholder">
            <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
          </div>
        </Link>
        <h2 className="text-2xl font-bold">Edit Sub Route</h2>
      </div>

      <div className="w-full max-w-8xl bg-white rounded-md shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Sub Route</label>
              <input type="text" name="subRoute" value={formData.subRouteName} onChange={handleInputChange} placeholder="Enter subroute" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Sub Route Code</label>
              <input type="text" name="subrouteCode" value={formData.subrouteCode} onChange={handleInputChange} placeholder="Enter Sub Route Code" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Main Route</label>

              <select
                name="mainRouteId"
                value={formData.mainRouteId} // This ensures the selected value matches the subroute's mainRouteId
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {/* Render the selected mainRoute from the subroute response */}
                {formData.mainRouteId && <option value={formData.mainRouteId}>{mainRoutes.find((route) => route._id === formData.mainRouteId)?.mainRouteName || "Loading..."}</option>}

                {/* Render all other mainRoutes */}
                {mainRoutes.map((route) =>
                  route._id !== formData.mainRouteId ? (
                    <option key={route._id} value={route._id}>
                      {route.mainRouteName}
                    </option>
                  ) : null
                )}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-normal text-[14px] leading-[16.94px] text-[#303F58]">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter Description" className="w-full h-[36px] px-3 py-2 border border-[#CECECE] rounded-[4px] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" style={{ resize: "none", overflow: "hidden" }} />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" className="px-2 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" onClick={() => navigate("/route/subroute")}>
              Cancel
            </button>
            <button type="submit" className="px-10 py-2 bg-red-800 text-white rounded-md hover:bg-red-800 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSubRoute
