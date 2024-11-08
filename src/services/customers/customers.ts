import axios from "axios";
import { BASEURL } from "../BaseURL";

interface ApiResponse {
    message?: string;
    data?: any;
    status?: number;
  }
  



export const getAllCustomersAPI = async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${BASEURL}/api/customer`);
  
      console.log("Response Status:", response.status); // Check the response status
      console.log("Response Data:", response.data); // Check the response data
  
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      console.error(`Error fetching customers:`, error);
      throw error; // Rethrow the error to be caught in the component
    }
  };