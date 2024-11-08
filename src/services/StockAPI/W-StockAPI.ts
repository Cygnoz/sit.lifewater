import axios from "axios";

import { STOCK_BASEURL } from "../Baseurl";

interface StockItem {
  itemName: string;
  quantity: number;
  amount: number;
  rate: number;
  itemImage: string;
}

interface StockData {
  warehouse: string;
  transferNumber: number;
  date?: string;
  items: StockItem[];
  notes?: string;
  termsAndConditions?: string;
}

export const createStock = async (stockData: StockData) => {
  try {
    const response = await axios.post(`${STOCK_BASEURL}/api/wstock`, stockData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create stock");
  }
};

export const getAllStocks = async () => {
    try {
      const response = await axios.get(`${STOCK_BASEURL}/api/wstock`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching stocks:', error.response?.data.message);
        throw new Error(error.response?.data.message || 'Failed to fetch stocks');
      }
      throw new Error('An unexpected error occurred');
    }
  };
