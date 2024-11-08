import shopping from "../assets//images/shopping-bag_staff.svg"
import salesmen from "../assets/images/salesman.svg"
import packing from "../assets/images/packing_.svg"
import seatbelt from "../assets/images/seatbelt.svg"
import printer from "../assets/images/printer.svg"
import vector from "../assets/images/Vector.svg"
import trash from "../assets/images/trash.svg"
import split from "../assets/images/list-filter.svg"
import plus from "../assets/circle-plus.svg"
import eye from "../assets/images/eye.svg"
import search from "../assets/images/search.svg"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { deleteStaffByIdAPI, getAllStaffsAPI } from "../services/AllApi"
import { BASEURL } from "../services/Baseurl"

const CreateStaff: React.FC = () => {
  interface Staff {
    firstname: string
    lastname: string
    designation: string // Add other fields as per your staff object structure
  }

  const navigate = useNavigate()
  // const [staffList, setStaffList] = useState([]) // Full staff list
  const [staffList, setStaffList] = useState<Staff[]>([])

  const [filteredStaffList, setFilteredStaffList] = useState<Staff[]>([]) // Fix here
  const [searchQuery, setSearchQuery] = useState("") // Search query state

  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"

  const handleCreate = (): void => {
    navigate("/addstaff")
  }

  const handleView = (id: any) => {
    navigate(`/viewstaff/${id}`) // Pass the staff ID to the view page
  }

  const handleEdit = (id: any): void => {
    navigate(`/editstaff/${id}`)
  }

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getAllStaffsAPI()
        console.log("Full API Response:", response) // Check the response
        setStaffList(response as any) // Store full staff list
        setFilteredStaffList(response as any) // Initially, display all staff
      } catch (error) {
        console.error("Error fetching staff data:", error)
      }
    }

    fetchStaff()
  }, [])

  useEffect(() => {
    console.log("Updated staff list:", staffList)
  }, [staffList])

  // Handle search input change and filter staff list
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    // Filter staff list based on search query
    const filteredList = staffList.filter((staff: any) => {
      return staff.firstname.toLowerCase().includes(query) || staff.lastname.toLowerCase().includes(query) || staff.address.toLowerCase().includes(query) || staff.mobileNumber.toLowerCase().includes(query) || staff.designation.toLowerCase().includes(query)
    })

    setFilteredStaffList(filteredList) // Update the filtered staff list
  }

  ///delete
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this staff?")
    if (!confirmDelete) return

    try {
      const response = await deleteStaffByIdAPI(id)
      alert(response.message) // Show success message

      // Remove the deleted staff from the list
      setStaffList(staffList.filter((staff: any) => staff._id !== id))
      setFilteredStaffList(filteredStaffList.filter((staff: any) => staff._id !== id))
    } catch (error) {
      console.error("Error deleting staff:", error)
      alert("An error occurred while deleting staff.")
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div>
        <div className="p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">Create Staff</h3>
              <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <div className="flex justify-between">
              <button onClick={handleCreate} className=" justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md">
                <img src={plus} alt="" />
                <p>Add New Staff</p>
              </button>

            </div>
          </div>
          {/* Cards Section */}
          <div className="grid grid-cols-4 gap-4 my-6">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={shopping} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Total Staff</div>
              <p className="text-[#4B5C79] w-[400] text-[12]">All staff members counted </p>
              <div className="w-[700px] text-[#820000] font-bold  leading-normal text-[18px] mt-3">{staffList.length}</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={salesmen} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Salesman</div>
              <p className="text-[#4B5C79] w-[400] text-[12]">Manages sales and clients.</p>

              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">{staffList.filter((staff) => staff.designation === "Sales").length}</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={packing} alt="" />
              <div className="w-[700px] font-bold leading-normal text-[#303F58] text-[17px] mt-2">Helpers</div>
              <p className="text-[#4B5C79] w-[400] text-[12]">Assists with various tasks.</p>
              <div className="w-[700px] text-[#820000] font-bold leading-normal text-[18px] mt-3">{staffList.filter((staff) => staff.designation === "Helper").length}</div>
            </div>

            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={seatbelt} alt="" />
              <div className=" font-bold leading-normal text-[#303F58] text-[17px] mt-2">Drivers</div>
              <p className="text-[#4B5C79] w-[400] text-[12]">Responsible for deliveries.</p>
              <div className="text-[#820000] font-bold leading-normal text-[18px] mt-3">{staffList.filter((staff) => staff.designation === "Driver").length}</div>
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
                placeholder="Search Staff"
                 value={searchQuery}
                  onChange={handleSearch}
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

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-full">
                <table className="min-w-full table-fixed">
                  <thead className="bg-[#fdf8f0] sticky top-0">
                    <tr className="border-b">
                    <th className="p-2 text-[12px] text-center text-[#303F58] w-16"> <input type="checkbox" /></th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-16">Sl No</th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-24">Photo</th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-36">Name</th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-64">Address</th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-36">Mobile</th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-36">Designation</th>
                      <th className="p-2 text-[12px] text-center text-[#303F58] w-24">Action</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="min-w-full h-[400px] overflow-y-auto">
                <table className="min-w-full table-fixed">
                  <tbody>
                    {filteredStaffList.length > 0 ? (
                      filteredStaffList.map((staff: any, index: number) => (
                        <tr className="border-b" key={staff._id}>
                           <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16"> <input type="checkbox" /></td>

                          <td className="p-2 text-[14px] text-center text-[#4B5C79] w-16">{index + 1}</td>
                          <td className="p-2 text-center w-24">
                            <img className="mx-auto object-cover w-11 h-11 rounded-full" src={staff.profile ? `${BASEURL}/uploads/${staff.profile}` : defaultImage} alt={`${staff.firstname} ${staff.lastname}`} />
                          </td>
                          <td className="p-2 text-[14px] text-center text-[#4B5C79] w-36">{staff.firstname } {staff.lastname}
                          </td>
                          <td className="p-2 text-[14px] text-center text-[#4B5C79] w-64">{staff.address}</td>
                          <td className="p-2 text-[14px] text-center text-[#4B5C79] w-36">{staff.mobileNumber}</td>
                          <td className="p-2 text-[14px] text-center text-[#4B5C79] w-36">{staff.designation}</td>
                          <td className="p-2 text-center w-24">
                            <button onClick={() => handleView(staff._id)} className="text-blue-500">
                              <img src={eye} alt="View" />
                            </button>
                            <button onClick={() => handleEdit(staff._id)} className="text-red-500 ml-2">
                              <img src={vector} alt="Edit" />
                            </button>
                            <button onClick={() => handleDelete(staff._id)} className="text-red-500 ml-2">
                              <img src={trash} alt="Delete" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-[#4B5C79]">
                          No staff data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default CreateStaff
