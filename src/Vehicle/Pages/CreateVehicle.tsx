import printer from "../../assets/images/printer.svg"
import vector from "../../assets/images/Vector.svg"
import trash from "../../assets/images/trash.svg"
import split from "../../assets/images/list-filter.svg"
import plus from "../../assets/circle-plus.svg"
import eye from "../../assets/images/eye.svg"

import search from "../../assets/images/search.svg"
import vehicle from "../../assets/images/vehicle 1.svg"

import { useNavigate } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import { deleteVehicleByIdAPI, getVehicleAPI, Vehicle } from "../../services/VehicleAPI/Vehicle"
import { BASEURL } from "../../services/Baseurl"

const CreateVehicle: React.FC = () => {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([])
  const [filteredVehicleList, setFilteredVehicleList] = useState<Vehicle[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const navigate = useNavigate()

  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const apiResponse = await getVehicleAPI()
        console.log("API Response:", apiResponse)

        if (Array.isArray(apiResponse)) {
          setVehicleList(apiResponse)
          setFilteredVehicleList(apiResponse)
        } else {
          console.error("Invalid API response structure:", apiResponse)
          setVehicleList([])
          setFilteredVehicleList([])
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error)
        setVehicleList([])
        setFilteredVehicleList([])
      }
    }

    fetchVehicle()
  }, [])

  useEffect(() => {
    const filteredVehicles = vehicleList.filter((vehicle) => {
      const searchLower = searchQuery.toLowerCase()
      return vehicle.vehicleNo.toLowerCase().includes(searchLower) || vehicle.insuranceStatus.toLowerCase().includes(searchLower) || vehicle.insuranceAmount.toString().includes(searchLower)
    })
    setFilteredVehicleList(filteredVehicles)
  }, [searchQuery, vehicleList])

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?")
    if (!confirmDelete) return

    try {
      const response = await deleteVehicleByIdAPI(id)
      alert(response.message)
      setVehicleList(vehicleList.filter((vehicle) => vehicle._id !== id))
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      alert("An error occurred while deleting vehicle.")
    }
  }

  const handleAdd = (): void => {
    navigate("/vehicle/addvehicle")
  }
  const handleEdit = (vehicleId: string): void => {
    navigate(`/vehicle/editvehicle/${vehicleId}`)
  }
  const handleView = (id: string) => {
    navigate(`/viewvehicle/${id}`)
  }


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
    <div>
      <div className="flex min-h-screen w-full">
        <div className="p-2">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">Create Vehicle Details</h3>
              <p className="text-[#4B5C79]">Lorem ipsum dolor sit amet consectetur</p>
            </div>
            <div className="flex justify-between">
              <button onClick={handleAdd} className="justify-between items-center gap-2 bg-[#820000] text-white flex px-5 py-2 rounded-md">
                <img src={plus} alt="" />
                <p>Add New Vehicle</p>
              </button>
              {/* <button className="ms-2 me-4">
                <img src={dot} alt="" />
              </button> */}
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-4 gap-4 my-6">
            <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={vehicle} alt="Vehicle Icon" className="w-8 h-8" />
                <div>
                  <div className="font-bold text-[#303F58] text-[17px] leading-normal">Total Vehicle</div>
                  <p className="text-[#4B5C79] text-[12px]">Lorem ipsum dolor sit amet</p>
                </div>
              </div>
              <div className="text-[#820000] font-bold text-[18px] mx-10 p-4">{filteredVehicleList.length}</div>
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
                placeholder="Search Vehicle"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th scope="col" className="no-print px-8 py-6">
                    <input type="checkbox" />
                  </th>
                  <th className="p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Sl No</th>
                  <th className="p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Photo</th>
                  <th className="p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Vehicle Number</th>
                  <th className="p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Insurance Validity</th>
                  <th className="p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Insurance Amount</th>
                  <th className="p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Insurance Status</th>
                  <th className="no-print p-2 text-[14px] font-medium text-center leading-[18px] text-[#303F58]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicleList.map((vehicle, index) => (
                  <tr key={vehicle._id || index} className="border-b">
                    <td className="no-print px-8 py-6">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{index + 1}</td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">
                      <img className="mx-auto object-cover w-11 h-11 rounded-full" src={vehicle.image ? `${BASEURL}/uploads/${vehicle.image}` : defaultImage} alt="Vehicle" />
                    </td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{vehicle.vehicleNo || "N/A"}</td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{vehicle.insuranceValidity ? new Date(vehicle.insuranceValidity).toLocaleDateString() : "N/A"}</td>
                    <td className="p-2 text-[14] text-center text-[#4B5C79]">{vehicle.insuranceAmount || "N/A"}</td>
                    <td className="p-2 text-[14] text-center ">
<span className={`bg-${vehicle.insuranceStatus === "Expired" ? "red" : "green"}-100 text-${vehicle.insuranceStatus === "Expired" ? "red" : "green"}-600 px-2 py-1 rounded-lg`}>
  {vehicle.insuranceStatus}
</span>
                    </td>
                    <td className="no-print p-2 text-[14] text-center text-[#4B5C79] ">
                      <button onClick={() => handleView(vehicle._id)} className="text-blue-500">
                        <img src={eye} alt="" />
                      </button>
                      <button onClick={() => handleEdit(vehicle._id)} className="text-red-500 ml-2">
                        <img src={vector} alt="" />
                      </button>
                      <button onClick={() => handleDelete(vehicle._id)} className="text-red-500 ml-2">
                        <img src={trash} alt="" />
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
  )
}

export default CreateVehicle
