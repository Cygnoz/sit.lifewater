import axios from "axios";
import { BASEURL } from "../BaseURL";
interface ApiResponse {
  success: boolean;
  message: string;
  // Add other fields as necessary based on the actual API response
}
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

  export const deleteActiveRouteAPI = async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axios.delete(`${BASEURL}/api/deleteRoutes/${id}`, {
        headers: {
          'Content-Type': 'application/json', // Ensure correct content type
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting active route:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Error deleting active route');
    }
  };