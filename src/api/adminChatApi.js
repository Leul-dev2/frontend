// src/api/adminChatApi.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://backend-ecomm-jol4.onrender.com/api/chats";

// Fetch all chats
export const fetchAllChats = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};

// Fetch messages for a given chatId
export const fetchMessages = async (chatId) => {
  if (!chatId) throw new Error("chatId is required");
  const response = await axios.get(`${BASE_URL}/${chatId}/messages`);
  return response.data;
};

// Send admin reply to a given chatId
export const sendAdminReply = async (chatId, message) => {
  if (!chatId) throw new Error("chatId is required");
  if (!message || message.trim() === "") throw new Error("message cannot be empty");
  const response = await axios.post(`${BASE_URL}/${chatId}/messages`, { message });
  return response.data;
};
