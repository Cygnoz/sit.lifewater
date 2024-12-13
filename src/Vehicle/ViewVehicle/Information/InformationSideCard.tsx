import mappinned from "../../../assets/images/map-pinned.svg"
import calender from "../../../assets/images/calendar-minus-2.svg"
import calender1 from "../../../assets/images/calendar-search.svg"
import { useContext } from "react"
import { AnVehicleResponseContext } from "../../../Context/ContextShare"

type Props = {}

const InformationSideCard = ({ }: Props) => {
    const { vehicleResponse } = useContext(AnVehicleResponseContext)!;

    const Card = [
        {
            icon: (mappinned),
            title: "Most Visited Route",
            value: "NA",
        },
        {
            icon: (calender),
            title: "Insurance Validity",
            value: vehicleResponse?.insuranceValidity 
            ? new Date(vehicleResponse.insuranceValidity).toISOString().split("T")[0] 
            : "NA",
        }, {
            icon: (calender1),
            title: "Licence Validity",
            value: vehicleResponse?.insuranceValidity 
            ? new Date(vehicleResponse.licenseValidity
            ).toISOString().split("T")[0] 
            : "NA" ,
        },
    ]
    return (
        <div>
            {
                Card.map((card) => (
                    <div className="p-8  rounded-[30px] my-2 flex  justify-between items-center w-[320px] ms-2 h-[123px]" style={{ background: "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)" }}>
                            <img src={card.icon} alt="" />
                        <div className="mt-1 ">
                            <p className="text-[#303F58] text-end font-bold text-[20px]">{card.value}</p>
                        <p className="text-[#303F58] text-end w-4000 text-[18px]">{card.title}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default InformationSideCard