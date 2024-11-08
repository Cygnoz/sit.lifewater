import axios from 'axios';
import { BASEURL } from '../BaseURL';

export const endRideAPI = async (payload: {
  activeRouteId: string;
  endingKM: number;
  travelledKM: number;
  salesMan: string;  // Added required fields
  driver: string;
  vehicleNo: string;
  mainRoute: string;
  stock: string;

  expenses: { remarks: string; amount: string }[];
}) => {
  try {
    const response = await axios.post(`${BASEURL}/api/end-ride`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to end ride:", error);
    throw error;  // Re-throw the error for any error handling in the calling code
  }
};

export const getAllEndRidesAPI = async () => {
  const response = await axios.get(`${BASEURL}/api/getallendride`);
  return response.data;
};