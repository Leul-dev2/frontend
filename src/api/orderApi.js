// src/api/orderApi.js
import axios from "axios";

const API_BASE_URL = "https://backend-ecomm-jol4.onrender.com/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getOrders = async () => {
  const res = await axios.get(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await axios.put(
    `${API_BASE_URL}/orders/${id}/status`,
    { status },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
