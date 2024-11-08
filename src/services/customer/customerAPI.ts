import axios from "axios";
import { BASEURL } from "../BaseURL";
import { commonAPI } from "../CommonApi";
// import { commonAPI } from "../CommonApi";

interface CustomerFormData {
  customerType: 'Business' | 'Individual';
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfBottles: string;
  rate: string;
  paymentMode: 'Cash' | 'Credit';
  contactNumber: string;
  whatsappNumber: string;
  depositAmount: string;
  location: {
    address: string;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
}

interface ApiResponse {
  message?: string;
  data?: any;
  status?: number;
}

export const addCustomerAPI = async (customerData: CustomerFormData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${BASEURL}/api/addsalesmancustomer`, customerData);

    console.log("Response Status:", response.status); // Check the response status
    console.log("Response Data:", response.data); // Check the response data

    return response;
  } catch (error: any) {
    if (error.response && error.response.status === 400 && error.response.data.message) {
      throw new Error(error.response.data.message); // Forward custom error message
    }
    throw error; // Rethrow the error to be caught in the component
  }
};

export const getACustomerAPI = async (id: string): Promise<ApiResponse> => {
  try {
    // Use `id` to fetch the customer by their ID
    const response = await commonAPI('GET', `${BASEURL}/api/customer/${id}`, null, {
      // No need to specify headers for GET requests
    });

    return response; // Ensure the response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error("Error fetching customer data:", error); // Log the full error for debugging
    return { message: error.message || "An unexpected error occurred." }; // Fallback error message
  }
};



export const updateCustomerAPI = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(`${BASEURL}/api/editcustomer/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the correct content type for form data
      },
    });
    return response.data; // Return the response data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};