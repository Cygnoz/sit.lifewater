import { Link } from "react-router-dom";
import Cards from "../../../commoncomponents/HomePageCards/Cards";
import foc from "../../../assets/images/Group 2500.png";
import cash from "../../../assets/images/Group 2499.png";
import credit from "../../../assets/images/Group 2498.png";
import { useContext, useEffect, useState } from "react";
import Table from "../../../commoncomponents/Table/Table";
import Button from "../../../commoncomponents/Buttons/Button";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
import PlusIcon from "../../../assets/icons/PlusIcon";
import total from "../../../assets/images/Group 2501.png"



const CustomerHome = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [customersData, setCustomersData] = useState<any[]>([]);
  const { request:getCustomersData } = useApi("get", 5005);
  const { loading , setLoading } = useContext(TableResponseContext)!;

  const [columns] = useState([
    { id: "Photo", label: "Photo", visible: true },
    { id: "name", label: "Name", visible: true },
    { id: "mobile", label: "Mobile", visible: true },
    { id: "mailroute", label: "Main Route", visible: true },
    { id: "subRoute", label: "Sub Route", visible: true },
    { id: "Coupon", label: "coupon", visible: true },
  ]);

  const getAllCustomers = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endpoints.GET_ALL_CUSTOMERS}`;
      const { response, error } = await getCustomersData(url);

      if (!error && response) {
        setCustomersData(response.data);
        setLoading({ ...loading, skeleton: false });
      } else {
        console.log(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  const cardData = [
    {
      imageSrc: total,
      title: "Total Customer",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: 120,
    },
    {
      imageSrc: foc,
      title: "FOC Customers",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: 80,
    },
    {
      imageSrc: cash,
      title: "Cash Customers",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: 45,
    },
    {
      imageSrc: credit,
      title: "Credit Customers",
      description: "Lorem ipsum dolor sit amet consectetur",
      count: 45,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[#303F58] text-[20px] font-bold">
            Create Customer
          </h3>
          <p className="text-[#4B5C79] text-sm">
            Lorem ipsum dolor sit amet consectetur{" "}
          </p>
        </div>
        <div className="flex justify-between">
          <Link to={"/addcustomer"}>
            <Button variant="primary" size="sm">
              <PlusIcon color="white"/>
              <p>Add New Customer</p>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-2">
        {cardData.map((card, index) => (
          <Cards
            key={index}
            imageSrc={card.imageSrc}
            title={card.title}
            description={card.description}
            count={card.count}
            isActive={activeCardIndex === index}
            onCardClick={() => setActiveCardIndex(index)}
          />
        ))}
      </div>

      <div className="bg-white p-5 mt-5 rounded-lg">
        <Table
          columns={columns}
          data={customersData}
          searchPlaceholder={"Search Customer"}
          loading={false}
          searchableFields={["name"]}
        />
      </div>
    </div>
  );
};

export default CustomerHome;
