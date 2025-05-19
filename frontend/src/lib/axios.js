import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api" 
    : `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
});

// Suppress 401 errors from logging in DevTools
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Return a resolved promise to prevent logging
      return Promise.resolve({ data: null, status: 401 });
    }
    return Promise.reject(error);
  }
);
