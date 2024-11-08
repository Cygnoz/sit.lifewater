import axios from 'axios';
import { STOCK_BASEURL } from '../Baseurl';

interface ApiResponse {
    success?: boolean; // You might want to have a success flag
    message?: string;
    data?: {
        warehouseName: string;
        contactNo: string;
        address: string;
    };
}

export const addWarehouseAPI = async (formData: {
  warehouseName: string;
  contactNo: string;
  address: string;
}): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${STOCK_BASEURL}/api/warehouse`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error adding warehouse:', error.response.data);
      return { message: error.response.data.message || 'An unexpected error occurred.' };
    } else {
      console.error('Unexpected error:', error);
      return { message: 'An unexpected error occurred.' };
    }
  }
};

//get
export const getWarehouseAPI = async () => {
  try {
    const response = await axios.get(`${STOCK_BASEURL}/api/warehouse`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('API Response:', response.data); // Log response
    return response.data; // Make sure this is an array of warehouse items
  } catch (error: any) {
    console.error('Error fetching warehouse:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching warehouse');
  }
};

//delete
export const deleteWarehouseIdAPI = async (id: string) => {
  try {
    const response = await fetch(`${STOCK_BASEURL}/api/warehouse/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // Ensure headers are correctly set if needed by your server
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Capture any error message from the server
      throw new Error(`Failed to delete warehouse: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error deleting warehouse:', error);
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};


