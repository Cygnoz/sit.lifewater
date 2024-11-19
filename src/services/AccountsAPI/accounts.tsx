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


export const getAllAccountsAPI = async () => {
  try {
    const response = await axios.get(`${BASEURL}/api/getallaccounts`, {
      headers: {
        'Content-Type': 'application/json', // Ensure correct content type
      },
    });
    return response.data; // Return the API response
  } catch (error: any) {
    console.error('Error fetching accounts:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching accounts');
  }
};


export const getOneTrialBalanceAPI = async (accountId: string) => {
  try {
    const response = await axios.get(`${BASEURL}/api/get-one-trial-balance/${accountId}`, {
      headers: {
        'Content-Type': 'application/json', // Ensure the correct content type
      },
    });
    return response.data; // Return the API response
  } catch (error: any) {
    console.error("Error fetching trial balance:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error fetching trial balance");
  }
};