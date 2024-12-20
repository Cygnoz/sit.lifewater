import { Modal } from "@mui/material";
import Eye from "../../../assets/icons/Eye";
import { useEffect, useState } from "react";
import line from "../../../assets/images/Rectangle 5557.png";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
interface itemDetails {
    itemName:string,
    sku:string,
    costPrice:string,
    sellingPrice:string,
    description:string
}
type Props = { id?: any };

function ViewItemModal({ id }: Props) {

    const [isModalOpen, setModalOpen] = useState(false);
    console.log(id);
  const [itemDetails, setItemDetails] = useState<itemDetails>()
  const [totQuantity, setTotQuantity] = useState()

    const { request: getItems } = useApi("get", 4001)

     const getAnItem = async () => {
        try {
          const url = `${endpoints.GET_AN_ITEM}/${id}`
          const { response, error } = await getItems(url)
    
          console.log("Full response:", response)
    
          if (!error && response) {    
            console.log(response);           
              setItemDetails(response?.data.item)  
              setTotQuantity(response?.data.totalQuantity)            
          }
        } catch (error) {
          console.error("Error fetching item details:", error)
        }
      }
    
      useEffect(() => {
        if (id) {
          getAnItem()
        }
      }, [id])

      const Items = [
        { title: "Item Name", data: itemDetails?.itemName || "NA" },
        { title: "SKU", data: itemDetails?.sku || "NA" },
        { title: "Cost Price", data: itemDetails?.costPrice || "NA" },
        { title: "Selling Price", data: (itemDetails?.sellingPrice || "NA") },
        { title: "Description", data: (itemDetails?.description || "NA") },
        { title: "Total Quantity", data: (totQuantity || "NA") },

    ];

    return (
        <div>
            <button className="mr-2" onClick={() => setModalOpen(true)}>
                <Eye color={"#569FBC"} />
            </button>
            <Modal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",                  

                }}
            >
                <div className="bg-white px-5 py-4 h-auto max-h-[90vh] w-[40%] rounded-lg overflow-auto">
                    <div
                        className="text-end text-3xl cursor-pointer"
                        onClick={() => setModalOpen(false)}
                    >
                        &times;
                    </div>
                    <div>
                        <h1 className="text-[18px] py-1 font-semibold">Item Details</h1>
                        <div>
                            <img className="w-[100%]  h-[0.2%]" src={line} alt="line" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-4">
                            {Items.map((item, index) => (
                                <div
                                    key={index}
                                    className="text-start rounded mt-3 p-3 bg-[#F6F6F6]"
                                >
                                    <p>{item.title}</p>
                                    <p className="text-[#4B5C79] text-[14px] pt-2">{item.data}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ViewItemModal;
