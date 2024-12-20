import { useEffect, useState } from "react";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import TableSkelton from "../../commoncomponents/Skelton/TableSkelton";
import NoDataFoundTable from "../../commoncomponents/Table/NoDataFoundTable";

interface RideData {
    _id: string;
    createdAt?: string;
    salesmanName: string;
    driverName: string;
    vehicleNumber: string;
    mainRouteName: string;
    stock: { itemName: string; quantity: number }[];
    travelledKM: number;
}
type Props = { SubRoute?: any }

const SubRouteRideHostory = ({ SubRoute }: Props) => {
    const [rides, setRides] = useState<RideData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState<boolean>(false);

    const Columns = [
        {
            label: "Sl No",
        }, {
            label: "Date",
        }, {
            label: "Sales Man",
        }, {
            label: "Driver",
        }, {
            label: "Vehicle",
        }, {
            label: "Route",
        }, {
            label: "Travelled KM",
        }, {
            label: "Stock",
        },
    ]
    const visibleColumns = Columns.filter((col) => col.label);
    const skeletonColumns = [...visibleColumns, {}, {}, {}];
    const { request: getALLRIDE } = useApi("get", 4000);

    const getALLRides = async () => {
        setLoading(true);

        try {
            const url = `${endpoints.GET_ALL_COMPLETED_RIDE}`;
            const { response, error } = await getALLRIDE(url);

            if (!error && response) {
                const AllRides = response?.data?.data;

                if (AllRides && SubRoute) {
                    // Filter rides based on subRouteName matching SubRoute
                    const FilteredRides = AllRides.filter((ride: any) => ride.subRouteName === SubRoute);
                    setRides(FilteredRides); // Set the filtered data to state
                    console.log("Filtered Rides:", FilteredRides);
                }
            }
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
        finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        getALLRides();
    }, []);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(rides.length / itemsPerPage);
    const paginatedRides = rides.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className="bg-white p-5 mt-5 rounded-lg">          
            <table className="w-full text-left">
            <thead className="bg-[#fdf8f0]">
                <tr className="border-b">
                    {
                        Columns.map((colum => (
                            <th className="p-2 text-[12px] text-center text-[#303F58]">
                                {colum.label}
                            </th>
                        )))
                    }
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    [...Array(itemsPerPage)].map((_, idx) => (
                        <TableSkelton key={idx} columns={skeletonColumns} />
                    ))
                ) : paginatedRides && paginatedRides.length > 0 ? (
                    paginatedRides.map((ride, index) => (
                        <tr className="border-b" key={ride._id}>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {ride.createdAt
                                    ? new Date(ride.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </td>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {ride.salesmanName}
                            </td>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {ride.driverName}
                            </td>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {ride.vehicleNumber}
                            </td>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {ride.mainRouteName}
                            </td>
                            <td className="p-2 text-[14] text-center text-[#4B5C79]">
                                {ride.travelledKM || "0"}
                            </td>

                        </tr>
                    ))
                ) : (
                    <NoDataFoundTable columns={skeletonColumns} />
                )}
            </tbody>
        </table>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div></div>
    )
}

export default SubRouteRideHostory