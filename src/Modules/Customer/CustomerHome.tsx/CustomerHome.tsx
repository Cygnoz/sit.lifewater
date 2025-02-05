import { Link, useNavigate } from "react-router-dom"
import Cards from "../../../commoncomponents/HomePageCards/Cards"
import foc from "../../../assets/images/Group 2500.png"
import cash from "../../../assets/images/Group 2499.png"
import credit from "../../../assets/images/Group 2498.png"
import { useContext, useEffect, useState } from "react"
import Table from "../../../commoncomponents/Table/Table"
import Button from "../../../commoncomponents/Buttons/Button"
import { TableResponseContext } from "../../../assets/Context/ContextShare"
import useApi from "../../../Hook/UseApi"
import { endpoints } from "../../../services/ApiEndpoint"
import PlusIcon from "../../../assets/icons/PlusIcon"
import total from "../../../assets/images/Group 2501.png"
import { toast, ToastContainer } from "react-toastify"

const CustomerHome = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)
  const [customersData, setCustomersData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([]) // New state for filtered data
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("") // State for selected payment mode
  const navigate = useNavigate()
  const { request: getCustomersData } = useApi("get", 4000)
  const { loading, setLoading } = useContext(TableResponseContext)!

  const [columns] = useState([
    { id: "customerID", label: "Customer ID", visible: true },
    { id: "fullName", label: "Name", visible: true },
    { id: "mobileNo", label: "Mobile", visible: true },
    { id: "mainRoute", label: "Main Route", visible: true },
    { id: "subRoute", label: "Sub Route", visible: true },
    { id: "paymentMode", label: "Payment Mode", visible: true },
  ])

  console.log(filteredData);

  const handleViewCustomer = (id: string) => {
    navigate(`/viewcustomer/${id}`);
  };

  const handleEditCustomer = (id: string) => {
    navigate(`/editcustomer/${id}`);
  }

  const { request: deleteCustomer } = useApi("delete", 4000);

  const handleDeleteCustomer = async (id: string) => {
    try {
      const url = `${endpoints.DELETE_A_CUSTOMER}/${id}`;
      const { response, error } = await deleteCustomer(url);
      getAllCustomers()
      if (!error && response) {
        toast.success(response?.data.message);
      }
      console.log(response);
    } catch (error) {
      toast.error("Error occurred while deleting brand.");
    }
  }

  const getAllCustomers = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false })
      const url = `${endpoints.GET_ALL_CUSTOMERS}`
      const { response, error } = await getCustomersData(url)

      if (!error && response) {
        setCustomersData(response.data)
        setFilteredData(response.data) // Set both customersData and filteredData initially
        console.log(customersData)
        setLoading({ ...loading, skeleton: false })
      } else {
        console.log(error)
        setLoading({ ...loading, skeleton: false, noDataFound: true })
      }
    } catch (error) {
      console.error(error)
      setLoading({ ...loading, skeleton: false, noDataFound: true })
    }
  }

  useEffect(() => {
    getAllCustomers()
  }, [])

  useEffect(() => {
    if (selectedPaymentMode) {
      // Filter data based on selected payment mode
      const filtered = customersData.filter(customer => customer.paymentMode === selectedPaymentMode);
      setFilteredData(filtered);
    } else {
      setFilteredData(customersData); // If no payment mode is selected, show all data
    }
  }, [selectedPaymentMode, customersData]); // Re-filter when payment mode or customersData changes

  // Dynamically calculate counts for each payment mode
  const getCustomerCountByPaymentMode = (paymentMode: string) => {
    return customersData.filter(customer => customer.paymentMode === paymentMode).length;
  };

  const cardData = [
    {
      imageSrc: total,
      title: "Total Customer",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: customersData.length, // Total count
    },
    {
      imageSrc: foc,
      title: "FOC Customers",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: getCustomerCountByPaymentMode("FOC"), // Dynamically calculated count
      filterMode: "FOC"
    },
    {
      imageSrc: cash,
      title: "Cash Customers",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: getCustomerCountByPaymentMode("Cash"), // Dynamically calculated count
      filterMode: "Cash"
    },
    {
      imageSrc: credit,
      title: "Credit Customers",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: getCustomerCountByPaymentMode("Credit"), // Dynamically calculated count
      filterMode: "Credit"
    },
  ]

  const handleCardClick = (paymentMode: string) => {
    setSelectedPaymentMode(paymentMode); // Set the selected payment mode to filter
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">Create Customer</h3>
          <p className="text-[#4B5C79] text-sm">You can show all the details of your customers  </p>
        </div>
        <div className="flex justify-between">
          <Link to={"/addcustomer"}>
            <Button variant="primary" size="sm">
              <PlusIcon color="white" />
              <p>Add New Customer</p>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-2">
        {cardData.map((card, index) => (
          <Cards key={index} imageSrc={card.imageSrc} title={card.title} description={card.description} count={card.count} isActive={activeCardIndex === index} onCardClick={() => { setActiveCardIndex(index); handleCardClick(card.filterMode || ""); }} />
        ))}
      </div>

      <div className="bg-white p-5 mt-5 rounded-lg">
        <Table 
          columns={columns} 
          data={filteredData}  // Use filteredData here
          searchPlaceholder="Search Customer" 
          loading={loading.skeleton} 
          searchableFields={["customerID", "fullName", "mobileNo", "mainRoute", "subRoute"]}
          onViewClick={handleViewCustomer} // Add this prop
          onEditClick={handleEditCustomer}
          onDeleteClick={handleDeleteCustomer}
        />
      </div>
    </div>
  )
}

export default CustomerHome;
