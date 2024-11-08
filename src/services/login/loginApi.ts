import { BASEURL } from "../BaseURL";
// import { commonAPI } from "../CommonApi";


interface LoginData {
  username: string;
  password: string;
}

interface StaffData {
  firstname: string;
  _id: string;
  profile: string;
  // Add other staff properties as needed
}

interface LoginResponse {
  message: string;
  staff: StaffData;
  status: number;
}

export const loginStaffAPI = async (loginData: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${BASEURL}/api/staff/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();
  return { ...data, status: response.status };
};

