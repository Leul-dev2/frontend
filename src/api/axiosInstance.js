// src/api/axiosInstance.js
import axios from "axios";

// ✅ Best practice: use env variable first, fallback second
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://backend-ecomm-jol4.onrender.com/api"; // or your backend URL

const instance = axios.create({
  baseURL: API_BASE,
});

// Add JWT token to all requests automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
