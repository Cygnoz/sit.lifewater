import axios from "axios";

const BASE_URLS: Record<number, string> = {
  4000: import.meta.env.VITE_REACT_APP_BACKEND,
  4001: import.meta.env.VITE_REACT_APP_STOCK,
  4002: import.meta.env.VITE_REACT_APP_ORDER,
};

// console.log(import.meta.env.VITE_REACT_APP_ORGANIZATION,"api");

const createInstance = (
  port: number,
  contentType: string,
  useAuth: boolean
) => {
  const baseURL = BASE_URLS[port];
  let headers: Record<string, string> = {
    "Content-Type": contentType,
    Accept: "application/json",
  };

  if (useAuth) {
    const authToken: string | null = localStorage.getItem("authToken");
    if (authToken) {
      headers = { ...headers, Authorization: `${authToken}`};
    }
  }
// console.log(headers,"headers");

  return axios.create({
    baseURL,
    headers,
  });
};

const baseInstance = (port: number) =>
  createInstance(port, "application/json", false);

const authInstance = (port: number) =>
  createInstance(port, "application/json", true);

const MauthInstance = (port: number) =>
  createInstance(port, "multipart/form-data", true);

export default { baseInstance, authInstance, MauthInstance };
