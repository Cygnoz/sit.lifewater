import { BASEURL } from "./Baseurl";
import { commonAPI } from "./CommonApi";
import axios from 'axios';
interface ApiResponse {
  message?: string;
  data?: any;
}

export const addStaffAPI = async (staffData: FormData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${BASEURL}/addstaff`, staffData, {
      headers: {
        'Content-Type': 'application/json'  // Ensure correct content type
      }
    });

    return response; // Ensure response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error("Error adding staff:", error); // Log the full error for debugging
    return { message: error.message || "An unexpected error occurred." }; // Fallback error message
  }
};


export const getAllStaffsAPI = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASEURL}/getallstaffs`);
    console.log("API Full Response:", response); // Log the entire response for debugging
    console.log("API Data:", response.data); // Log the extracted data
    
    return response.data; // Extract and return the actual data
  } catch (error: any) {
    console.error("Error fetching staff data:", error.response || error); // Log detailed error info
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};



export const getStaffByIdAPI = async (id: string): Promise<ApiResponse> => {
  try {
    // Use `id` instead of `_id`
    const response = await commonAPI('GET', `${BASEURL}/staff/${id}`, null, {
      // No need to specify any headers for GET requests
    });

    return response; // Ensure the response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error("Error fetching staff data:", error); // Log the full error for debugging
    return { message: error.message || "An unexpected error occurred." }; // Fallback error message
  }
}

export const deleteStaffByIdAPI = async (id: string) => {
  try {
    const response = await fetch(`${BASEURL}/staff/${id}`, {
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



// Update staff by ID
export const updateStaffAPI = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(`${BASEURL}/api/staff/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json'  // Ensure correct content type
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update staff');
  }
};




