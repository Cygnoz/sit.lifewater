import axios from "axios";
import { BASEURL } from "../BaseURL";
import { commonAPI } from "../CommonApi";

interface ApiResponse {
    message?: string;
    data?: any;
  }
  


export const getSubRoutesAPI = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/viewSRoute`, {
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

  export const getRoutesAPI = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/getAllRoutes`, {
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

  export const getAllStaffsAPI = async (): Promise<ApiResponse> => {
    try {
      const response = await commonAPI('GET', `${BASEURL}/api/getallstaffs`, null, {
        // No need to specify any headers for GET requests
      });
  
      return response; // Ensure the response matches the expected ApiResponse structure
    } catch (error: any) {
      console.error("Error fetching staff data:", error); // Log the full error for debugging
      return { message: error.message || "An unexpected error occurred." }; // Fallback error message
    }
  };

  export const getVehicleAPI = async (): Promise<ApiResponse> => {
    try {
        const response = await commonAPI('GET', `${BASEURL}/api/viewVehicles`, null);
        return response; // Ensure the response matches the expected ApiResponse structure
    } catch (error: any) {
        console.error("Error fetching vehicle data:", error);
        return { message: error.message || "An unexpected error occurred." }; // Fallback error message
    }
};

export const addActiveRouteAPI = async (formData: any) => {
    try {
      const response = await axios.post(`${BASEURL}/api/activroutes`, formData, {
        headers: {
          'Content-Type': 'application/json',  // Ensure correct content type
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding active route:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Error adding active route');
    }
  };