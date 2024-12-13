import { useContext } from "react";
import InformationSideCard from "./InformationSideCard"
import { AnVehicleResponseContext } from "../../../Context/ContextShare";
import { Link } from "react-router-dom";
import Pen from "../../../assets/icons/Pen";

type Props = {}

const InformationStatus = ({ }: Props) => {
    const { vehicleResponse } = useContext(AnVehicleResponseContext)!;
    console.log(vehicleResponse,"context");
    
    const Card = [
        {
            title: "Today Route",
            value: "Kochi",
            amount: "NA",
        },
        {
            title: "Deposit Amount",
            value: "AED",
            amount: "NA",
        }, {
            title: "Insurance Amount",
            value: "AED",
            amount: (vehicleResponse?.insuranceAmount?vehicleResponse.insuranceAmount : "NA"),
        },
    ]
    const GeneralStatus = [
        {
            title: "Vehicle Number",
            value: (vehicleResponse?.vehicleNo || "NA"),
        },
        {
            title: "Insurance Validity",
            value: vehicleResponse?.insuranceValidity 
            ? new Date(vehicleResponse.insuranceValidity).toISOString().split("T")[0] 
            : "NA"        
        },
             {
            title: "Insurance Amount",
            value: (vehicleResponse?.insuranceAmount || "NA")
        }, {
            title: "License Validity",
            value: vehicleResponse?.insuranceValidity 
            ? new Date(vehicleResponse.licenseValidity
            ).toISOString().split("T")[0] 
            : "NA" 
        },
    ]
    const OtherDetails = [
        {
            title: "Expense",
            value: (vehicleResponse?.expenses || "NA"),
        }, {
            title: "Started Km",
            value: (vehicleResponse?.startingKilometer || "NA"),
        }, {
            title: "Ending Km",
            value: "NA"
        }, {
            title: "Total Km",
            value: "NA"
        },
    ]
    return (
        <div className="flex gap-10">
            <div className="">
                <InformationSideCard />
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mx-2 mt-2 w-[80%]">
                <div className="mb-6 flex justify-between">
                    <h2 className="text-2xl font-bold text-gray-700">Status</h2>
                    <div className=" bg-[#0B9C56] rounded-full p-2 cursor-pointer">
                        <Link to={`/vehicle/editvehicle/${vehicleResponse._id}`}>
                            <Pen color="white" size={18} />
                        </Link>

                    </div>
                </div>
                <div className="grid grid-cols-3 gap-5 ">
                    {
                        Card.map((card) => (
                            <div className="text-end p-4 border-2 rounded-lg bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE]">

                                <div className="flex gap-3 justify-end">
                                    <h2 className="text-xl font-semibold text-gray-800">{card.value}</h2>
                                    <p className="text-[18px]  text-[#303F58] w-400">{card.amount}</p></div>
                                <p className="text-[16px] mt-0.5 text-[#303F58] w-400">{card.title}</p>
                            </div>
                        ))
                    }
                </div>
                <div className="grid grid-cols-2">
                    <div className="pt-5 mx-1">
                        <h3 className="font-semibold text-lg text-gray-700 ">General Details</h3>
                        {
                            GeneralStatus.map((status) => (
                                <div className="py-2 px-2">
                                    <p className="text-[#4B5C79] text-[14px] w-600">{status.title}</p>
                                    <p className="text-[1234] text-[14px] font-semibold">{status.value}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="py-5 mx-1">
                        <h3 className="font-semibold text-lg text-gray-700">Other Details</h3>
                        {
                            OtherDetails.map((details) => (
                                <div className="py-2 px-2">
                                    <p className="text-[#4B5C79] text-[14px] w-600">{details.title}</p>
                                    <p className="text-[1234] text-[14px] font-semibold">{details.value}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InformationStatus