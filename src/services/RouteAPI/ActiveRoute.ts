import axios from "axios";
import { BASEURL } from "../Baseurl";



export const getActiveRouteAPI = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/getActiveRoutes`, {
        headers: {
          'Content-Type': 'application/json'  // Ensure correct content type
        }
      });
      return response.data;
    } catch (error:any) {
      console.error('Error fetching routes:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Error fetching routes');
    }
  };

  export const getActiveRouteByIdAPI = async (id: string | number) => {
    try {
        const response = await axios.get(`${BASEURL}/api/viewActiveRoute/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000  // Optional timeout
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching route with ID ${id}:`, error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || `Error fetching route with ID ${id}`);
    }
};
  

export const getAllEndRidesAPI = async () => {
  try {
    const response = await axios.get(`${BASEURL}/api/getallendride`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rides:", error);
    return [];
  }
};
