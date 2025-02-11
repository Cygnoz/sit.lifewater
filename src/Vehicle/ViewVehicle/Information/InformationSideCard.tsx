
import calender from "../../../assets/images/calendar-minus-2.svg";
import calender1 from "../../../assets/images/calendar-search.svg";
import { useContext } from "react";
import { AnVehicleResponseContext } from "../../../Context/ContextShare";

type Props = {};

const InformationSideCard = ({ }: Props) => {
    const { vehicleResponse } = useContext(AnVehicleResponseContext)!;

    const formatDate = (dateString: string) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return "NA";
        }
        return new Date(dateString).toISOString().split("T")[0];
    };

    const Card = [
        {
            icon: calender,
            title: "Insurance Validity",
            value: formatDate(vehicleResponse?.insuranceValidity),
        }, 
        {
            icon: calender1,
            title: "Licence Validity",
            value: formatDate(vehicleResponse?.licenseValidity),
        },
    ];

    return (
        <div>
            {Card.map((card, index) => (
                <div key={index} className="p-8 rounded-[30px] my-2 flex justify-between items-center w-[320px] ms-2 h-[123px]" 
                    style={{ background: "linear-gradient(91.71deg, #FFE3B8 -19.39%, #D5DCB3 97.82%)" }}>
                    <img src={card.icon} alt={card.title} className="w-10 h-10" />
                    <div className="mt-1 text-end">
                        <p className="text-[#303F58] font-bold text-[20px]">{card.value}</p>
                        <p className="text-[#303F58] w-4000 text-[18px]">{card.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InformationSideCard;
