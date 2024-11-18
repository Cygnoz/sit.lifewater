import axios from "axios";
import { BASEURL } from "../Baseurl";

// Replace with your actual base URL


export const createAccountAPI = async (formData: any) => {
  try {
    const response = await axios.post(`${BASEURL}/api/addaccounts`, formData, {
      headers: {
        'Content-Type': 'application/json', // Ensure correct content type
      },
    });
    return response.data; // Return the API response
  } catch (error: any) {
    console.error('Error creating account:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error creating account');
  }
};
