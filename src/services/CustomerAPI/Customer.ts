// import { BASEURL } from "../Baseurl";
// import { commonAPI } from "../CommonApi";


// interface ApiResponse {
//   message?: string;
//   data?: any;
//   status?:number;
// }

// export const addBusinessCustomerAPI = async (customerData: FormData): Promise<ApiResponse> => {
//   try {
//     const response = await commonAPI('POST', `${BASEURL}/api/business-customer`, customerData, {
//       // No need to specify Content-Type for FormData
//     });

//     return response; // Ensure response matches the expected ApiResponse structure
//   } catch (error: any) {
//     console.error("Error adding business customer:", error); // Log the full error for debugging
//     return { message: error.message || "An unexpected error occurred while adding the business customer." }; // Fallback error message
//   }
// };

// export const addIndividualCustomerAPI = async (individualData:FormData): Promise<ApiResponse> => {
//   try {
//     const response = await commonAPI('POST', `${BASEURL}/api/customer`,individualData,{
      
//     });
//     return response;
// }catch(error:any) {
//   console.error("Error adding individual customer:", error); // Log the full error for debugging
//   return { message: error.message || "An unexpected error occurred while adding the individual customer." };
// }
// };


// import axios from "axios";
import axios from "axios";
import { BASEURL } from "../Baseurl";
import { commonAPI } from "../CommonApi";

interface ApiResponse {
  message?: string;
  data?: any;
  status?: number;
}


// // Combined API function for adding both business and individual customers
// export const addCustomerAPI = async (customerData: FormData): Promise<ApiResponse> => {
//   try {
//     // POST to a single endpoint
//     const response = await commonAPI('POST', `${BASEURL}/api/addcustomer`, customerData, {
//       // No need to specify Content-Type for FormData
//     });
//     console.log(response);
//     return response; // Ensure response matches the expected ApiResponse structure
    
//   } catch (error: any) {
//     console.error(`Error adding customer of type `, error); // Log the full error for debugging
//     throw error; // Rethrow the error so it can be caught in the component
//   }
// };


export const addCustomerAPI = async (customerData: FormData): Promise<ApiResponse> => {
  try {
    const response = await commonAPI('POST', `${BASEURL}/api/addcustomer`, customerData);

    console.log("Response Status:", response.status); // Check the response status
    console.log("Response Data:", response.data); // Check the response data

    return response;
  } catch (error: any) {
    console.error(`Error adding customer:`, error);
    throw error; // Rethrow the error to be caught in the component
  }
};

// export const getBCustomerAPI = async()=>{
//   try{
//     const response = await axios.get(`${BASEURL}/api/business-customer`)
//     console.log(response);
    
//   }
//   catch(error:any){
//     console.error(`Error getting customer:`, error);
//     throw error; 
//   }
// }

export const getAllCustomersAPI = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASEURL}/api/customer`);

    console.log("Response Status:", response.status); // Check the response status
    console.log("Response Data:", response.data); // Check the response data

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error fetching customers:`, error);
    throw error; // Rethrow the error to be caught in the component
  }
};



// export const deleteCustomerAPI = async (id: string) => {
//   try {
//     const response = await axios.delete(`${BASEURL}/api/customer/${id}`);
//     if (response.status === 200) {
//       console.log('Customer deleted successfully');
//       return true;
//     }
//   } catch (error) {
//     console.error('Error deleting customer:', error);
//     return false;
//   }
// };

export const deleteCustomerAPI = async (id: string) => {
  try {
    const response = await axios.delete(`${BASEURL}/api/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
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
