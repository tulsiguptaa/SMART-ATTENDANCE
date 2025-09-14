import axios from "axios";

// Base API URL - Read from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8008/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies, authorization headers with HTTPS
  timeout: 10000, // 10 seconds
});

// Request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }
    
    // Handle specific status codes
    const { status, data } = error.response;
    
    if (status === 401) {
      // Handle unauthorized (token expired, invalid token, etc.)
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject({ message: 'Session expired. Please log in again.' });
    }
    
    // Handle other errors
    const errorMessage = data?.message || 'An unexpected error occurred';
    return Promise.reject({ message: errorMessage, status });
  }
);

// ---- API methods ---- //

// Auth APIs
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getUserProfile = () => api.get("/auth/profile");

// Attendance APIs
export const markAttendance = (data) => api.post("/attendance/mark", data);
export const getAttendanceHistory = () => api.get("/attendance/history");

// Users APIs
export const getAllUsers = () => api.get("/users");

// Export the axios instance if needed
export default api;
