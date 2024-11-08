import React, { useEffect, useState } from "react"
import back from "../../assets/images/backbutton.svg"
import { Link, useParams } from "react-router-dom"
import list from "../../assets/images/list-todo.svg"
import history from "../../assets/images/history.svg"
import mappinned from "../../assets/images/map-pinned.svg"
import calender from "../../assets/images/calendar-minus-2.svg"
import calender1 from "../../assets/images/calendar-search.svg"
import { getVehicleByIdAPI } from "../../services/VehicleAPI/Vehicle"
import { BASEURL } from "../../services/Baseurl"

const ViewVehicle: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"information" | "rideHistory">("information")
  const [vehicle, setVehicle] = useState<any>(null) // Changed to any for flexibility
  const { id } = useParams() // Get the staff ID from the URL
  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await getVehicleByIdAPI(id as string)
        console.log(response)
        setVehicle(response)
      } catch (error: any) {
        console.error("Error fetching vehicle data:", error.message)
      }
    }

    if (id) {
      fetchVehicle()
    }
  }, [id])

  if (!vehicle) return <div>Loading...</div> // Loading state
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Row 1: View Customer Profile */}
      <div className="flex items-center space-x-2 mb-6">
        <button className="text-gray-600">
          <Link to={"/vehicle"}>
            <div className="icon-placeholder">
              <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
            </div>
          </Link>
        </button>
        <h1 className="text-xl font-bold text-gray-800">View Customer Profile</h1>
      </div>

      {/* Row 2: Profile Picture and Vehicle Number in a rounded container */}
      <div className="bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] rounded-[8px] p-[16px_18px] flex items-center space-x-[24px] mb-6 w-[1299px] h-[92px]">
        <img src={vehicle.vehicle.image ? `${BASEURL}/uploads/${vehicle.vehicle.image}` : defaultImage} alt="Uploaded Vehicle" className="w-19 h-12 bg-gradient-to-r from-white-100 to-gray-200 rounded-full flex items-center justify-center" />
        <span className="text-[18px] font-bold text-gray-700 leading-[21.78px] text-left font-inter">{vehicle?.vehicle.vehicleNo}</span>
      </div>

      {/* Row 3: Tabs in a smaller container with equal button sizes and icons */}
      <div className="bg-[#FFFFFD] shadow-md rounded-[8px] p-[8px_16px] flex justify-center items-center gap-[6px] mb-6 mx-20 w-[1145px] h-[52px]">
        <button className={`flex-3 flex items-center justify-center py-2 rounded-md font-medium space-x-2 px-6 ${activeTab === "information" ? "bg-gray-200" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("information")}>
          <img src={list} alt="Information" />
          <span className="text-gray-700">Information</span>
        </button>

        <button className={`flex-1 flex items-center justify-start py-2 rounded-md font-medium space-x-2 px-6 ${activeTab === "rideHistory" ? "bg-gray-200" : "hover:bg-gray-200"}`} onClick={() => setActiveTab("rideHistory")}>
          <img src={history} alt="Ride History" />
          <span className="text-gray-700">Ride History</span>
        </button>
      </div>

      {/* Row 4: Content - Conditional Rendering based on activeTab */}
      {activeTab === "information" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side (Cards) */}
          <div className="md:col-span-1 space-y-[20px]">
            {/* Card 1: Most Visited Route */}
            <div className="p-8 rounded-[24px] flex justify-between items-center w-[388px] mx-8 h-[123px]" style={{ background: "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)" }}>
              <img src={mappinned} alt="Most Visited Route" />
              <div className="text-right">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{vehicle?.createdAt}</h2>
                <p className="text-gray-600">Most Visited Route</p>
              </div>
            </div>

            {/* Card 2: Insurance Validity */}
            <div className="p-8 rounded-[24px] flex justify-between items-center w-[388px] mx-8 h-[123px]" style={{ background: "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)" }}>
              <img src={calender} alt="Insurance Validity" />
              <div className="text-right">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {vehicle?.vehicle.insuranceValidity
                    ? new Date(vehicle.vehicle.insuranceValidity)?.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </h2>

                <p className="text-gray-600">Insurance Validity</p>
              </div>
            </div>

            {/* Card 3: License Validity */}
            <div className="p-8 rounded-[24px] flex justify-between items-center w-[388px] mx-8 h-[123px]" style={{ background: "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)" }}>
              <img src={calender1} alt="License Validity" />
              <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
      {vehicle?.vehicle.licenseValidity ? vehicle.vehicle.licenseValidity.split("T")[0] : "N/A"}
    </h2>
                <p className="text-gray-600">License Validity</p>
              </div>
            </div>
          </div>

          {/* Right Side (Stats) */}
          <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6 mx-4">
            {/* Stats Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-700">Stats</h2>
            </div>

            {/* Cards: Today Route, Deposit Amount, Insurance Amount */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-end p-4 border-2 rounded-lg bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE]">
                <h2 className="text-xl font-bold text-gray-800">{vehicle?.todayRoute}</h2>
                <p className="text-gray-700">Today Route</p>
              </div>

              <div className="text-end p-4 border-2 rounded-lg bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE]">
                <h2 className="text-xl font-semibold text-gray-800">{vehicle?.depositAmount ? `AED ${vehicle.depositAmount}` : "AED 0"}</h2>
                <p className="text-gray-700">Deposit Amount</p>
              </div>

              <div className="text-end p-4 border-2 rounded-lg bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE]">
                <h2 className="text-xl font-semibold text-gray-800">{vehicle?.vehicle.insuranceAmount ? `AED ${vehicle?.vehicle.insuranceAmount}` : "AED 0"}</h2>
                <p className="text-gray-700">Insurance Amount</p>
              </div>
            </div>

            {/* General Details and Other Details */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-5 p-2 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">General Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">Vehicle Number</p>
                  <p>{vehicle?.vehicle.vehicleNo || "N/A"}</p>
                  <p className="text-gray-700">Insurance Validity</p>
                  <p>{vehicle?.vehicle.insuranceValidity?.split("T")[0] || "N/A"}</p>
                  <p className="text-gray-700">Insurance Amount</p>
                  <p>{vehicle?.vehicle.insuranceAmount || "0"}</p>
                  <p className="text-gray-700">License Validity</p>
                  <p>{vehicle?.vehicle.licenseValidity?.split("T")[0] || "N/A"}</p>
                </div>
              </div>
              <div className="bg-gray-5 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">Other Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">Expense</p>
                  <p>{vehicle?.vehicle.expenses || "0"}</p>
                  <p className="text-gray-700">Started Km</p>
                  <p>{vehicle?.vehicle.startingKilometer || "0"}</p>
                  <p className="text-gray-700">Ending Km</p>
                  <p>{vehicle?.vehicle.expense || "0"}</p>
                  <p className="text-gray-700">Total Km</p>
                  <p>{vehicle?.vehicle.expense || "0"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mx-4">
          {/* Ride History Content */}
          <p className="text-gray-700">Ride history details go here...</p>
        </div>
      )}
    </div>
  )
}

export default ViewVehicle
