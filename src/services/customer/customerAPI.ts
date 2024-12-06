import axios from "axios";
import { BASEURL } from "../BaseURL";
import { commonAPI } from "../CommonApi";
// import { commonAPI } from "../CommonApi";

interface CustomerFormData {
  customerType: 'Business' | 'Individual';
  companyName: string;
  fullName: string;
  addressLine1:string;
  addressLine2:string;
  // lastName: string;
  email: string;
  numberOfBottles: string;
  ratePerBottle: string;
  paymentMode: 'Cash' | 'Credit' | 'Coupon';
  mobileNo: string;
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
    const response = await axios.post(`${BASEURL}/addcustomer`, customerData);

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
    const response = await commonAPI('GET', `${BASEURL}/customer/${id}`, null, {
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
    // Log the FormData to ensure it's populated correctly
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await axios.put(`${BASEURL}/editcustomer/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',  // Set the correct content type for form data
      },
    });
    return response.data; // Return the response data
  } catch (error: any) {
    console.error("Error updating customer:", error);
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};
