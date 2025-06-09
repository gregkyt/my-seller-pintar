import { V1ErrorResponse } from "@/modules/domain/auth-domain";
import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_SERVICE_BASE_URL;
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    return processError(error);
  }
);

function processError(error: AxiosError) {
  if (error.response?.data) {
    const errorResponse = error.response.data;
    return Promise.reject(errorResponse as V1ErrorResponse);
  }
}

export { api };
