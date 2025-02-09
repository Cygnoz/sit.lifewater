import { useEffect, useState } from "react";
import useApi from "../Hook/UseApi";
import { endpoints } from "../services/ApiEndpoint";

interface RideDetails {
  _id: string;
  mainRouteId: string;
  mainRouteName: string;
  subRouteId: string;
  subRouteName: string;
  helperId: string;
  helperName: string;
  driverId: string;
  driverName: string;
  salesmanId: string;
  salesmanName: string;
  vehicleNumber: string;
  startingKm: string;
  status: string;
  createdDate: string;
  __v: number;
}

const Ride = () => {
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch active route with salesman ID
  const { request: getActiveRoute } = useApi("get", 4000);
  const SalesManId = localStorage.getItem("SalesManId");

  const fetchActiveRoute = async () => {
    setLoading(true);
    try {
      const url = `${endpoints.GET_AN_ACTIVE_ROUTE_WITH_SALESMEN_ID}/${SalesManId}`;
      const { response, error } = await getActiveRoute(url);

      if (!error && response?.data?.activeRide) {
        setRideDetails(response.data.activeRide);
      }
    } catch (error) {
      console.error("Error fetching active route:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRoute();
  }, []);

  return (
    <div className="bg-white p-5 m-3">
      {loading ? (
        <div className="p-2 text-center text-gray-500">Loading...</div>
      ) : rideDetails ? (
        <div className="p-4 border rounded-lg shadow-md bg-white">
          <div className="mb-4">
            <p className="font-semibold text-lg">Ride Start At</p>
            <p className="text-gray-600 px-1">
              {rideDetails.createdDate ? new Date(rideDetails.createdDate).toLocaleString() : "N/A"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium text-gray-700">
              <p className="py-2">Salesman</p>
              <p className="py-2">Sub Route</p>
              <p className="py-2">Main Route</p>
              <p className="py-2">Driver</p>
              <p className="py-2">Helper</p>
              <p className="py-2">Vehicle No</p>
              <p className="py-2">Starting KM</p>
            </div>
            <div className="text-gray-600">
              <p className="py-2">: {rideDetails.salesmanName || "N/A"}</p>
              <p className="py-2">: {rideDetails.mainRouteName || "N/A"}</p>
              <p className="py-2">: {rideDetails.subRouteName || "N/A"}</p>
              <p className="py-2">: {rideDetails.driverName || "N/A"}</p>
              <p className="py-2">: {rideDetails.helperName || "N/A"}</p>
              <p className="py-2">: {rideDetails.vehicleNumber || "N/A"}</p>
              <p className="py-2">: {rideDetails.startingKm || "N/A"}</p>
            </div>
            <div>

            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No Ride Details Found</div>
      )}
    </div>
  );
};

export default Ride;
