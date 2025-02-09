import { useEffect, useState } from "react";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";
import { Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = { id: any }
interface OrderData {
    date: string,
    orderNumber: string,
    stock: [{
        itemName: string
    }],
    ratePerItem: string,
    returnBottle: string,
    paymentMode: string,
    customerName: string,
    totalAmount: string,
    balanceAmount: number,
    paidAmount: number,
    _id:string
}
const ViewOrderModal = ({ id }: Props) => {
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { request: getAOrder } = useApi("get", 4001);
    // Get All customer
    const getOrder = async () => {
        setLoading(true);
        try {
            const url = `${endpoints.GET_ALL_ORDER}/${id}`;
            const { response, error } = await getAOrder(url);

            if (!error && response) {
                setOrderData(response.data);
                // console.log("API RESPONSE :", response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };
    useEffect(() => {
        getOrder();
    }, []);
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/editorder/${orderData?._id}`);
    };
    return (
        <div className="">
            <button onClick={() => setModalOpen(true)} className="bg-[#F6F6F6] h-6 w-12 text-[13px] rounded-md  border border-[#820000]">
                View
            </button>
            <Modal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                style={{ width: "100%" }}>


                <div className="bg-gradient-to-l from-[#E3E6D5] mx-5 to-[#F7E7CE] mt-[50%] px-5 pb-5 rounded-xl" >
                    {loading ? (
                        <div>
                            <p className="text-center pt-5">Loading...</p>

                        </div>
                    ) : (
                        <>

                            <div
                                className="ms-auto text-end text-3xl cursor-pointer"
                                onClick={() => setModalOpen(false)}
                            >
                                &times;
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#303F58]">Customer</p>
                                <div>
                                    <button onClick={handleEdit} className="bg-[#F6F6F6] hidden ms-1 h-5 w-12 text-[13px] rounded-md  border border-[#820000]">
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <p className="text-[#303F58] text-[16px] font-bold">
                                {orderData?.customerName}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[#303F58]">Order Number</p>
                                    <p className="text-[#303F58]">Item</p>
                                    <p className="text-[#303F58]">Quantity</p>
                                    <p className="text-[#303F58]">Rate Per Item</p>
                                    <p className="text-[#303F58]">Return Empty Bottle</p>
                                </div>
                                <div>
                                    <p className="text-[#303F58]">: {orderData?.orderNumber}</p>
                                    <p className="text-[#303F58]">
                                        :{" "}
                                        {orderData?.stock?.map((item: any, index: number) => (
                                            <span key={index}>{item.itemName}</span>
                                        ))}
                                    </p>
                                    <p className="text-[#303F58]">
                                        :{" "}
                                        {orderData?.stock?.map((item: any, index: number) => (
                                            <span key={index}>{item.quantity}</span>
                                        ))}
                                    </p>
                                    <p className="text-[#303F58]">: {orderData?.ratePerItem}</p>
                                    <p className="text-[#303F58]">: {orderData?.returnBottle ? orderData.returnBottle : "0"}</p>
                                </div>
                            </div>
                            <div className=" bg-[#FFFFFF] px-2 py-1.5 gap-2 mt-2 rounded-md items-center">
                                <div className="grid grid-cols-2 ">
                                    <div className="">
                                        <p className="text-[14px] text-[#303F58]">Payment Mode</p>
                                        <p className="text-[14px] text-[#303F58]">Total Amount</p>
                                       
                                        <div>
                                                    <p className="text-[14px] text-[#303F58]">Paid Amount</p>
                                                    <p className="text-[14px] text-[#303F58]">Balance Amount</p>
                                                </div> {
                                           
                                        }
                                    </div>
                                    <div className="">
                                        <p className="text-[14px] text-[#303F58] font-semibold">
                                            : {orderData?.paymentMode}
                                        </p>
                                        <p className="text-[14px] text-[#303F58] font-bold">
                                            : {orderData?.totalAmount}.00 AED
                                        </p>
                                                <div>
                                                    <p className="text-[14px] text-[#303F58] font-semibold">: {orderData?.paidAmount}.00 AED</p>
                                                    <p className="text-[14px] text-[#303F58] font-semibold">: {orderData?.balanceAmount}.00 AED</p>
                                                </div>
                                        {/* {
                                            orderData?.paymentMode === "Cash" && (
                                            )
                                        } */}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


            </Modal>

        </div>
    )
}

export default ViewOrderModal