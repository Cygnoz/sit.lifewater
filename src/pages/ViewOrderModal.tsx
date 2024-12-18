import { useEffect, useState } from "react";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import { useParams } from "react-router-dom";

type Props = {}
interface OrderData {
    date: string,
    orderNumber: string,
    stock: [{
        itemName: string
    }],
    ratePerItem: string,
    ReturnBottle: string,
    paymentMode: string,
    customerName: string,
}
const ViewOrderModal = ({ }: Props) => {
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const { request: getAOrder } = useApi("get", 4001);
    const { id } = useParams();
    // Get All customer
    const getOrder = async () => {
        try {
            const url = `${endpoints.GET_ALL_ORDER}/${id}`;
            const { response, error } = await getAOrder(url);

            if (!error && response) {
                setOrderData(response.data);
                console.log("API RESPONSE :", response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);
    return (
        <div className="px-3">
            <div className="bg-gradient-to-l from-[#E3E6D5] to-[#F7E7CE] my-3 p-5 rounded-xl" >
                <div className="flex justify-between">
                    <p className="text-[#303F58]">Customer</p>
                    <p className="text-[#303F58]">{orderData?.date}</p>
                </div>
                <p className="text-[#303F58] text-[16px] font-bold ms-1">{orderData?.customerName}</p>
                <div className="grid grid-cols-2">
                    <div>
                        <p className="text-[#303F58] pt-1">Order Number</p>
                        <p className="text-[#303F58] pt-1">Item</p>
                        <p className="text-[#303F58] pt-1">Rate Per Item</p>
                        <p className="text-[#303F58] pt-1">Return Empty Botle</p>
                    </div>
                    <div>
                        <p className="text-[#303F58] pt-1">: {orderData?.orderNumber}</p>
                        <p className="text-[#303F58] pt-1">: {orderData?.stock.map((item: any) => (
                            item.itemName
                        ))}</p>
                        <p className="text-[#303F58] pt-1">: {orderData?.ratePerItem}</p>
                        <p className="text-[#303F58] pt-1">: {orderData?.ReturnBottle} Botle</p>
                    </div>
                </div>
                <div className="flex bg-[#FFFFFF] px-2 py-1 gap-2 mt-2 rounded-md items-center">
                    <p className="text-[14px] text-[#303F58]">Payment Mode</p>
                    <span className="h-3 w-[2px] bg-[#9EA9BB]"></span>
                    <p className="text-[12px] text-[#303F58] font-bold">{orderData?.paymentMode}</p>
                </div>
            </div></div>
    )
}

export default ViewOrderModal