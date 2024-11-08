import axios from "axios";

import { STOCK_BASEURL } from "../Baseurl";

interface StockItem {
  itemName: string;
  quantity: number;
  amount: number;
  rate: number;
}

interface StockData {
  warehouse: string;
  transferNumber: number;
  mainRoute: string;
  subRoute:string
  date?: string;
  items: StockItem[];
  notes?: string;
  termsAndConditions?: string;
}


export const addStockLoadedApi = async (stockData: StockData) => {
    try {
      const response = await axios.post(`${STOCK_BASEURL}/api/stock`, stockData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Failed to add loaded stock");
    }
  };

  
export const getAllStockloaded = async () => {
  try {
    const response = await axios.get(`${STOCK_BASEURL}/api/stock`,);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching stockloaded:', error.response?.data.message);
      throw new Error(error.response?.data.message || 'Failed to fetch stockloaded');
    }
    throw new Error('An unexpected error occurred');
  }
};
