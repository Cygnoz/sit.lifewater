import vehicle from "../../assets/images/vehicle 1.svg";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { TableResponseContext } from "../../assets/Context/ContextShare";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import Table from "../../commoncomponents/Table/Table";
import AddNewButton from "../../commoncomponents/Buttons/AddNewButton";

const CreateVehicle: React.FC = () => {
  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const [columns] = useState([
    { id: "vehicleNo", label: "Vehicle Number", visible: true },
    { id: "insuranceValidity", label: "Insurance Validity", visible: false },
    { id: "insuranceAmount", label: "Isurance Amount", visible: true },
    { id: "insuranceStatus", label: "Insurance Status", visible: true },
  ]);
  const { request: getAllVehicleData } = useApi("get", 4000);
  const getAllVehicle = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endpoints.GET_ALL_VEHICLES}`;
      const { response, error } = await getAllVehicleData(url);
      if (!error && response) {
        setVehicleList(response.data);
        console.log(response.data, "vehicle");
        setLoading({ ...loading, skeleton: false });
      } else {
        console.log(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.log(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllVehicle();
  }, []);

  const { request: deleteVehicle } = useApi("delete", 4000);

  const handleDeleteVehicle = async (id: string) => {
    try {
      const url = `${endpoints.DELETE_VEHICLE}/${id}`;
      const { response, error } = await deleteVehicle(url);
      
      if (!error && response) {
        toast.success(response?.data.message);
        getAllVehicle();
      } else {
        toast.error(error?.response?.data?.message || "Error occurred while deleting vehicle.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error occurred while deleting vehicle.");
    }
  };
  


  const handleEditVehicle = (vehicleId: string): void => {
    navigate(`/vehicle/editvehicle/${vehicleId}`);
  };
  const handleViewVehicle = (id: string) => {
    navigate(`/viewvehicle/${id}`);
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        theme="colored"
      />

      <div className="flex min-h-screen w-full">
        <div className="p-2 w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#303F58] text-[20px] font-bold">
                Create Vehicle Details
              </h3>
              <p className="text-[#4B5C79]">
                Stay on top of your vehicle details.
              </p>
            </div>
            <div className="flex justify-between">
              <Link to={"/vehicle/addvehicle"}>
                <AddNewButton>
                  <p>Add New Vehicle</p>
                </AddNewButton>
              </Link>
            </div>
          </div>

          {/* Cards Section */}
          <div className="w-[30%] my-6">
            <div className=" p-4 bg-white shadow-md rounded-lg">
              <div className="flex justify-between  items-center space-x-4">
                <div className="flex gap-3">
                  <img
                    src={vehicle}
                    alt="Vehicle Icon"
                    className="w-8 h-8 mt-2"
                  />
                  <div>
                    <p className="font-bold text-[#303F58] text-[17px] leading-normal">
                      Total Vehicle
                    </p>
                    <p className="text-[#4B5C79] text-[12px]">
                      Overview of all vehicles in your fleet.{" "}
                    </p>
                  </div>
                </div>
                <p className=" justify-end text-end text-[#303F58] text-[18px] leading-normal font-bold">
                  {vehicleList.length}
                </p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <Table
              columns={columns}
              data={vehicleList}
              onViewClick={handleViewVehicle} // Add this prop
              onEditClick={handleEditVehicle}
              onDeleteClick={handleDeleteVehicle}
              searchPlaceholder="Search Vehicle"
              loading={loading.skeleton}
              searchableFields={[
                "vehicleNo",
                "insuranceValidity",
                "insuranceStatus",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVehicle;
