import total from "../../assets/images/Group 2501.png"
import foc from "../../assets/images/Group 2500.png"
import cash from "../../assets/images/Group 2499.png"
import credit from "../../assets/images/Group 2498.png"
import plus from "../../assets/circle-plus.svg"
import eye from "../../assets/images/eye.svg"
import dot from "../../assets/ellipsis-vertical.svg"
import printer from "../../assets/images/printer.svg"
import vector from "../../assets/images/Vector.svg"
import trash from "../../assets/images/trash.svg"
import split from "../../assets/images/list-filter.svg"
import { Link, useNavigate } from "react-router-dom"
import search from "../../assets/images/search.svg"
import { useEffect, useState } from "react"
import { deleteCustomerAPI, getAllCustomersAPI } from "../../services/CustomerAPI/Customer"
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from "react-toastify"
import { BASEURL } from "../../services/Baseurl"




const CreateCustomer: React.FC = () => {
  const navigate =useNavigate()

  const handleView =(id:string)=>{
    navigate(`/viewcustomer/${id}`)
  }
  const handleEdit =(id:string)=>{
    navigate(`/editcustomer/${id}`)
  }

  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomersAPI();
        setCustomers(response.data); // Store customers in state
      } catch (error) {
        console.error("Error fetching customers:", error);
      } 
    };

    fetchCustomers();
  }, []);

  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"


  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomerAPI(id);
        // Remove the deleted customer from the local state
        setCustomers(customers.filter((customer) => customer._id !== id));
        console.log(`Customer ${id} deleted successfully.`);
        toast.success("Customer deleted successfully");
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer. Please try again.");
      }
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

<div className="flex min-h-screen w-full">
      <div>
        <div className="p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">
                Create Customer
              </h3>
              <p className="text-[#4B5C79]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
            </div>
            <div className="flex justify-between">
              <Link to={'/addcustomer'}>
              <button
                
                className="flex justify-between items-center gap-2 bg-[#820000] text-white  px-5 py-2 rounded-md"
              >
                <img src={plus} alt="" />
                <p>Add New Customer</p>
              </button>
              
              </Link>
              

              <button className="ms-2 me-4">
                <img src={dot} alt="" />
              </button>
            </div>
          </div>
          {/* Cards Section */}
          <div className="grid grid-cols-4 gap-4 my-6">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <img className="w-[40px] h-[35px] " src={total} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Total Customer
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                120
              </div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img className="w-[40px] h-[35px] " src={foc} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                FOC Customer
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                10
              </div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img className="w-[40px] h-[35px] " src={cash} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Cash Customer
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
                20
              </div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img className="w-[40px] h-[35px] " src={credit} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">
                Credit Customer
              </div>
              <p className="text-[#4B5C79] w-[400] text-[12]">
                Lorem ipsum dolor sit amet consectetur{" "}
              </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">
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
                placeholder="Search Customer"
                 
              />
              <div className="flex w-[60%] justify-end">
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 me-2 rounded-lg">
                  <img className="mt-1 me-1" src={split} alt="" />
                  Sort By
                </button>
                <button className="flex border text-[14] w-[500] text-[#565148] border-[#565148] px-4 py-2 rounded-lg">
                  <img className="mt-1 me-1" src={printer} alt="" />
                  Print
                </button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[#fdf8f0]">
                <tr className="border-b">
                <th className="p-2 text-[12px] text-center text-[#303F58] w-16"> <input type="checkbox" /></th>

                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sl No
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Photo
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Name
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                  Mobile
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Main Route
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Sub Route
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Coupon
                  </th>
                  <th className="p-2 text-[12px] text-center text-[#303F58]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
              {customers.map((customer,index)=>(
                 <tr className="border-b" key={customer.id} >
                 <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {index + 1} </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                  {/* <img className="mx-auto object-cover w-11 h-11 rounded-full" src={customer.logo} alt="" />  */}
                  <img className="mx-auto object-cover w-11 h-11 rounded-full" src={customer.logo ? `${BASEURL}/uploads/${customer.logo}` : defaultImage} alt={`${customer.firstName} ${customer.lastName}`} />
                  </td>

                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                 {customer.firstName} {customer.lastName} </td>
                <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                {customer.mobileNo}
                </td>
              <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                {customer.mainRoute}
              </td>
              <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                {customer.subRoute}
              </td>
            <td className="p-2 text-[14px] text-center text-[#4B5C79]">
                No
            </td>
                                        
            <td className="p-2 text-[14px] text-center text-[#4B5C79]">
              <button onClick={() =>handleView(customer._id)} className="text-blue-500"><img src={eye} alt="View" /></button>
              <button className="text-red-500 ml-2" onClick={() =>handleEdit(customer._id)}><img src={vector} alt="Edit" /></button>
              <button className="text-red-500 ml-2"  onClick={() => handleDelete(customer._id)} ><img src={trash} alt="Delete" /></button>
            </td>
        </tr>
        ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>  </div>
    );
  };
   
  export default CreateCustomer;