// import { BASEURL } from "../Baseurl";
// import { commonAPI } from "../CommonApi";


// interface ApiResponse {
//   message?: string;
//   data?: any;
//   status?:number;
// }

// export const addBusinessCustomerAPI = async (customerData: FormData): Promise<ApiResponse> => {
//   try {
//     const response = await commonAPI('POST', `${BASEURL}/business-customer`, customerData, {
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
//     const response = await commonAPI('POST', `${BASEURL}/customer`,individualData,{
      
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


<<<<<<< HEAD
// // Combined API function for adding both business and individual customers
// export const addCustomerAPI = async (customerData: FormData): Promise<ApiResponse> => {
//   try {
//     // POST to a single endpoint
//     const response = await commonAPI('POST', `${BASEURL}/addcustomer`, customerData, {
//       // No need to specify Content-Type for FormData
//     });
//     console.log(response);
//     return response; // Ensure response matches the expected ApiResponse structure
=======
// Combined API function for adding both business and individual customers
export const addCustomerAPI = async (customerData: FormData): Promise<ApiResponse> => {
  try {
    // POST to a single endpoint
    const response = await commonAPI('POST', `${BASEURL}/addcustomer`, customerData, {
      // No need to specify Content-Type for FormData
    });
    console.log(response);
    return response; // Ensure response matches the expected ApiResponse structure
>>>>>>> 1235185e81313e82aaeb438cde991b3e7c149a4b
    
  } catch (error: any) {
    console.error(`Error adding customer of type `, error); // Log the full error for debugging
    throw error; // Rethrow the error so it can be caught in the component
  }
};


// export const addCustomerAPI = async (customerData: FormData | Record<string, any>): Promise<ApiResponse> => {
//   try {
//     const isFormData = customerData instanceof FormData;
    
//     const headers: Record<string, string> = {
//       'Accept': 'application/json',
//     };

//     if (!isFormData) {
//       headers['Content-Type'] = 'application/json';
//     }



//     const response = await axios.post(`${BASEURL}/api/addcustomer`, customerData, { headers });

//     console.log("Response Status:", response.status);
//     console.log("Response Data:", response.data);

//     return response.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         console.error("Backend Error:", error.response.data);
//         return {
//           status: error.response.status,
//           message: error.response.data.message || "An error occurred while adding the customer.",
//         };
//       } else if (error.request) {
//         console.error("Network Error:", error.message);
//         return {
//           status: 0,
//           message: "Network error. Please check your internet connection.",
//         };
//       }
//     }
//     console.error("Unexpected Error:", error);
//     return {
//       status: 500,
//       message: "An unexpected error occurred.",
//     };
//   }
// };


<<<<<<< HEAD
export const addCustomerAPI = async (customerData: FormData | Record<string, any>): Promise<ApiResponse> => {
  try {
    const isFormData = customerData instanceof FormData;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post(`${BASEURL}/addcustomer`, customerData, { headers });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Backend Error:", error.response.data);
        return {
          status: error.response.status,
          message: error.response.data.message || "An error occurred while adding the customer.",
        };
      } else if (error.request) {
        console.error("Network Error:", error.message);
        return {
          status: 0,
          message: "Network error. Please check your internet connection.",
        };
      }
    }
    console.error("Unexpected Error:", error);
    return {
      status: 500,
      message: "An unexpected error occurred.",
    };
  }
};

// export const getBCustomerAPI = async()=>{
//   try{
//     const response = await axios.get(`${BASEURL}/business-customer`)
//     console.log(response);
    
//   }
//   catch(error:any){
//     console.error(`Error getting customer:`, error);
//     throw error; 
//   }
// }
=======
>>>>>>> 1235185e81313e82aaeb438cde991b3e7c149a4b

export const getAllCustomersAPI = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASEURL}/customer`);

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



<<<<<<< HEAD
// export const deleteCustomerAPI = async (id: string) => {
//   try {
//     const response = await axios.delete(`${BASEURL}/customer/${id}`);
//     if (response.status === 200) {
//       console.log('Customer deleted successfully');
//       return true;
//     }
//   } catch (error) {
//     console.error('Error deleting customer:', error);
//     return false;
//   }
// };
=======
>>>>>>> 1235185e81313e82aaeb438cde991b3e7c149a4b

export const deleteCustomerAPI = async (id: string) => {
  try {
    const response = await axios.delete(`${BASEURL}/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
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
    const response = await axios.put(`${BASEURL}/editcustomer/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json', // Set the correct content type for form data
      },
    });
    return response.data; // Return the response data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};
