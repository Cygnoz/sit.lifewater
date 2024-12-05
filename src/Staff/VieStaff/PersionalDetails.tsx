import line from "../../assets/images/line.png";
import map from "../../assets/images/map-pin.svg";
import status from "../../assets/images/folder-status.svg";
import nationality from "../../assets/images/nationality.svg";
import visaNo from "../../assets/images/visa no.svg";
import validity from "../../assets/images/visa validity.svg";
import date from "../../assets/images/date-route.svg";
import emirates from "../../assets/images/emirates.png";
import { useContext } from "react";
import { AnStaffResponseContext } from "../../Context/ContextShare";
import Pen from "../../assets/icons/Pen";
import { Link } from "react-router-dom";

type Props = {}

const PersionalDetails = ({ }: Props) => {
    const defaultImage =
        "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png";

    const { staffResponse } = useContext(AnStaffResponseContext)!;
    console.log(staffResponse, "contextdata");

    const Details = [
        {
            icon: (map),
            title: "Address",
            content: (staffResponse?.address || "NA")
        },
        {
            icon: (status),
            title: "Visa Status",
            content: (staffResponse?.visaStatus || "NA")
        },
        {
            icon: (nationality),
            title: "Nationality",
            content: (staffResponse?.nationality || "NA")
        },
        {
            icon: (visaNo),
            title: "Visa Number",
            content: (staffResponse?.visaNumber || "NA")
        },
        {
            icon: (validity),
            title: "Visa Validity",
            content: ("NA")
        },
        {
            icon: (date),
            title: "Date Of Birth",
            content: ("NA")
        },
        {
            icon: (emirates),
            title: "Emirates ID",
            content: (staffResponse?.emiratesId || "NA")
        },
    ]

    return (
        <div className="w-ful mx-auto mb-5 py-2 px-5 bg-white shadow-md rounded-lg ">
            <div className="flex justify-between items-center bg-gradient-to-l from-[#cead7c] to-[#a8b18c] rounded-lg h-[82px] space-x-4">
                <div className="flex">
                    <img
                        src={
                            staffResponse.profile
                                ? staffResponse.profile
                                : defaultImage
                        }
                        className="w-16 mx-5  p-1 rounded-full"
                        alt="Staff Profile"
                    />

                    <div className=" gap-3">
                        <div className="flex mt-2 gap-3">
                            <h2 className="text-[18px] text-[#FCF8ED] font-[500]">
                                {staffResponse.firstname}  {staffResponse.lastname}
                            </h2>
                            <img src={line} alt="" />
                            <p className="text-[18px] text-[#FCF8ED] font-[300]">
                                {staffResponse.mobileNumber}
                            </p>
                        </div>
                        <p className="text-[15px] font-[350] text-[#FCF8ED] ">
                            {staffResponse.designation}

                        </p>
                    </div>
                </div>
                <div className="pe-5">
                    <div className=" bg-white rounded-full p-2 cursor-pointer">
                        <Link to={`/editstaff/${staffResponse._id}`}>
                            <Pen color="#0B9C56" size={18} />
                        </Link>

                    </div>
                </div>



            </div>
            <div className="grid grid-cols-4 my-4">
                {
                    Details.map((details) => (
                        <div className="m-5 ">
                            <p className="text-[#4B5C79] text-[14px] font-[600] flex ">
                                <img className="me-2" src={details.icon} alt="" />
                                {details.title}

                            </p>
                            <p className="text-[#8F99A9] text-[14px] font-[600] pt-2">
                                {details.content}
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PersionalDetails