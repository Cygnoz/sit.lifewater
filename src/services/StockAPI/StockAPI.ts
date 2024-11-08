
import { STOCK_BASEURL } from '../Baseurl';
import { commonAPI } from "../CommonApi";

interface ApiResponse {
  message?: string;
  data?: any;
  item?: Item;
}

export interface Item {
  _id: string; // Use _id to match the API response
  itemName: string;
  SKU: string;
  purchasePrice: number;
  retailPrice: number;
  description: string;
  itemImage: string;
}

// Function to add an item
export const addItemAPI = async (formData: FormData): Promise<ApiResponse> => {
  try {
    const response = await commonAPI('POST', `${STOCK_BASEURL}/api/item`, formData, {
      // No need to specify Content-Type for FormData
    });
    return response; // Ensure response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error('Error adding item:', error); // Log the full error for debugging
    return { message: error.message || 'An unexpected error occurred.' }; // Fallback error message
  }
};

// Function to get all items
export const getItemsAPI = async (): Promise<any> => {
  try {
    const response = await commonAPI('GET', `${STOCK_BASEURL}/api/item`, null);
    return response; // Ensure the response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error('Error fetching items:', error);
    return { message: error.message || 'An unexpected error occurred.' }; // Fallback error message
  }
};

// Function to get a single item by ID
export const getItemByIdAPI = async (id: string): Promise<any> => {
  try {
    const response = await commonAPI('GET', `${STOCK_BASEURL}/api/getitem/${id}`, null);
    return response; // Ensure the response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error('Error fetching item by ID:', error);
    return { message: error.message || 'An unexpected error occurred.' }; // Fallback error message
  }
};


// Function to update an item by ID
export const updateItemAPI = async (id: string, formData: FormData): Promise<ApiResponse> => {
  try {
    const response = await commonAPI('PUT', `${STOCK_BASEURL}/api/edititem/${id}`, formData, {
      // No need to specify Content-Type for FormData
    });
    return response; // Ensure response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error('Error updating item:', error);
    return { message: error.message || 'An unexpected error occurred.' }; // Fallback error message
  }
};

// Function to delete an item by ID
export const deleteItemAPI = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await commonAPI('DELETE', `${STOCK_BASEURL}/api/item/${id}`, null);
    return response; // Ensure response matches the expected ApiResponse structure
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return { message: error.message || 'An unexpected error occurred.' }; // Fallback error message
  }
};