import axios from "axios";
import { BASEURL } from "../Baseurl";

export const addJournalEntryAPI = async (formData: any) => {
    try {
      const response = await axios.post(`${BASEURL}/add-journal-entry`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding journal entry:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Error adding journal entry');
    }
  };

  


  export const getAllJournalsAPI = async () => {
    try {
      const response = await axios.get(`${BASEURL}/get-all-journal`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching journals:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error fetching journals.");
    }
  };
  

  export const getOneJournalAPI = async (id: string) => {
    try {
      const response = await axios.get(`${BASEURL}/get-one-journal/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching journal:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error fetching journal.");
    }
  };
  