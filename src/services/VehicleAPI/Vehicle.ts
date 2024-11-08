import axios from "axios";
import { BASEURL } from "../Baseurl";
import { commonAPI } from "../CommonApi";


interface ApiResponse {
    message?: string;
    data?: any;
    vehicle?: Vehicle;
  }


  export interface Vehicle {
    _id: string; // Use _id to match the API response
    vehicleNo: string;
    image: string;
    insuranceValidity: string;
    insuranceStatus: string;
    registrationValidity: string;
    insuranceAmount: number;
    licenseAmount: number;
    licenseValidity: string;
    startingKilometer: number;
    expenses: number;
    createdAt: string;
    updatedAt: string;
}

export const addVehicleAPI = async (vehicleData: FormData): Promise<ApiResponse> => {
    try {
      const response = await commonAPI('POST', `${BASEURL}/api/addVehicle`, vehicleData, {
        // No need to specify Content-Type for FormData
      });
  
      return response; // Ensure response matches the expected ApiResponse structure
    } catch (error: any) {
      console.error("Error adding vehicle:", error); // Log the full error for debugging
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

export const getVehicleByIdAPI = async (id: string): Promise<ApiResponse> => {
    try {
      // Use `id` instead of `_id`
      const response = await commonAPI('GET', `${BASEURL}/api/viewvehicle/${id}`, null, {
        // No need to specify any headers for GET requests
      });
  
      return response; // Ensure the response matches the expected ApiResponse structure
    } catch (error: any) {
      console.error("Error fetching staff data:", error); // Log the full error for debugging
      return { message: error.message || "An unexpected error occurred." }; // Fallback error message
    }
  }


export const deleteVehicleByIdAPI = async (id: string) => {
    try {
      const response = await fetch(`${BASEURL}/api/deletevehicle/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error deleting staff:', error);
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  };


  export const updateVehicleAPI = async (id: string, formData: FormData) => {
    try {
      const response = await axios.put(`${BASEURL}/api/editvehicle/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct content type for form data
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update vehicle');
    }
  };
  
