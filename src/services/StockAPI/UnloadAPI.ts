import { STOCK_BASEURL } from '../Baseurl';
import axios from 'axios';

// Define the types for the Unload data
interface Item {
  quantity: number;
  rate: number;
  product: string;
  amount: number;
}

interface UnloadData {
  mainRoute: string;
  warehouseName: string;
  date: string;
  transferNumber: string;
  items: Item[];
  autoNotes?: string;
  termsAndConditions?: string;
}



// Define the type for the expected API response
interface ApiResponse {
  message: string;
  data?: any;
  error?: string;
  status:Number;
}

// API function to add an unload entry
// API function to add an unload entry
export const addUnloadAPI = async (unloadData: UnloadData): Promise<ApiResponse> => {
  try {
    const { data } = await axios.post<ApiResponse>(`${STOCK_BASEURL}/api/addunload`, unloadData);
    return { ...data, status: 201 }; // Return the data with status
  } catch (error: any) {
    console.error('Error adding unload:', error);
    
    // Handle errors based on the structure returned by Axios
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
    const status = error.response?.status || 500;

    return { message: errorMessage, error: error.message, status };
  }
};
  // Create a function to get all unloads
export const getAllUnloadsAPI = async () => {
  try {
    const response = await axios.get(`${STOCK_BASEURL}/api/unload`); // Adjust the endpoint as per your backend
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching unloads:', error);
    throw error; // Throw error to handle it in your component
  }
};
