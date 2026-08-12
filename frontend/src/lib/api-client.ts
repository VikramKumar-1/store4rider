import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Send HttpOnly cookies automatically
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, like redirecting to login on 401
    // or refreshing token if 401 and we have a refresh route.
    return Promise.reject(error);
  }
);
