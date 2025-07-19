// src/api/userApi.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getUsersCount = async () => {
  const res = await axios.get(`${API_BASE_URL}/users/count`);
  return res.data; // { count: number }
};
