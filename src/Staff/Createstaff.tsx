import shopping from "../assets/images/Group 2505.png";
import salesmen from "../assets/images/Group 2504.png";
import packing from "../assets/images/Group 2503.png";
import seatbelt from "../assets/images/Group 2502.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { endpoints } from "../services/ApiEndpoint";
import useApi from "../Hook/UseApi";
import { TableResponseContext } from "../assets/Context/ContextShare";
import Table from "../commoncomponents/Table/Table";
import Cards from "../commoncomponents/HomePageCards/Cards";
import AddNewButton from "../commoncomponents/Buttons/AddNewButton";
import { toast, ToastContainer } from "react-toastify";

const CreateStaff: React.FC = () => {
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getAllStaffData } = useApi("get", 4000);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [columns] = useState([
    { id: "firstname", label: "Name", visible: true },
    { id: "profile", label: "Photo", visible: false },
    { id: "address", label: "Address", visible: true },
    { id: "mobileNumber", label: "Mobile", visible: true },
    { id: "designation", label: "Designation", visible: true },
  ]);

  const getAllStaff = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });
      const url = `${endpoints.GET_ALL_STAFF}`;
      const { response, error } = await getAllStaffData(url);
      if (!error && response) {
        setStaffData(response.data);
        setFilteredStaff(response.data);
        setLoading({ ...loading, skeleton: false });
      } else {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const handleViewCustomer = (id: string) => {
    navigate(`/viewstaff/${id}`);
  };

  const handleEditCustomer = (id: string) => {
    navigate(`/editstaff/${id}`);
  };

  const { request: deleteStaff } = useApi("delete", 4000);
  const handleDeleteCustomer = async (id: string) => {
    try {
      const url = `${endpoints.DELETE_AN_STAFF}/${id}`;
      const { response, error } = await deleteStaff(url);
  
      if (!error && response) {
        toast.success(response?.data.message);
        getAllStaff();
      } else {
        toast.error(error?.response?.data?.message || "Error occurred while deleting customer.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error occurred while deleting customer.");
    }
  };
  

  // Count designations
  const designationCounts = (staffData || []).reduce((acc, item) => {
    const designation = item.designation?.toLowerCase();
    if (designation) {
      acc[designation] = (acc[designation] || 0) + 1;
    }
    return acc;
  }, {});

  const handleCardClick = (index: number, designation: string | null) => {
    setActiveCardIndex(index);
    if (designation) {
      setFilteredStaff(staffData.filter(item => item.designation?.toLowerCase() === designation.toLowerCase()));
    } else {
      setFilteredStaff(staffData);
    }
  };

  const Card = [
    {
      icon: shopping,
      title: "Total Staff",
      subtitle: "All staff members counted",
      count: staffData?.length || "N/A",
      filter: null,
    },
    {
      icon: salesmen,
      title: "Salesman",
      subtitle: "Manages sales and clients",
      count: designationCounts["sales"] || "NA",
      filter: "Sales",
    },
    {
      icon: packing,
      title: "Helpers",
      subtitle: "Assists with various tasks",
      count: designationCounts["helper"] || "NA",
      filter: "Helper",
    },
    {
      icon: seatbelt,
      title: "Drivers",
      subtitle: "Responsible for deliveries",
      count: designationCounts["driver"] || "NA",
      filter: "Driver",
    },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <div className="w-full">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">Create Staff</h3>
              <p className="text-[#4B5C79] ">Efficiently manage and organize your team with ease.</p>
            </div>
            <div className="flex justify-between">
              <Link to={"/addstaff"}>
                <AddNewButton>
                  <p>Add New Staff</p>
                </AddNewButton>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 my-3">
            {Card.map((card, index) => (
              <Cards
                key={index}
                imageSrc={card.icon}
                title={card.title}
                description={card.subtitle}
                count={card.count}
                isActive={activeCardIndex === index}
                onCardClick={() => handleCardClick(index, card.filter)}
              />
            ))}
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-4">
            <Table
              columns={columns}
              data={filteredStaff}
              onViewClick={handleViewCustomer}
              onEditClick={handleEditCustomer}
              onDeleteClick={handleDeleteCustomer}
              searchPlaceholder="Search Staff"
              loading={loading.skeleton}
              searchableFields={["firstname", "mobileNumber", "designation", "address"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;
