// ✅ src/api/adminChatApi.js
import axios from "axios";

// Make sure .env has no spaces! Example:
// REACT_APP_API_URL=https://backend-ecomm-jol4.onrender.com/api
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("✅ Using BASE_URL:", BASE_URL);

export const fetchAllChats = async () => {
  const res = await axios.get(`${BASE_URL}/chats/all`);
  return res.data; // Should be an array or { chats: [] }
};

export const fetchMessages = async (chatId) => {
  if (!chatId) throw new Error("chatId required");
  const res = await axios.get(`${BASE_URL}/chats/${chatId}/messages`);
  return res.data;
};

export const sendAdminReply = async (chatId, message) => {
  if (!chatId) throw new Error("chatId required");
  if (!message) throw new Error("message required");
  const res = await axios.post(`${BASE_URL}/chats/${chatId}/messages`, { message });
  return res.data;
};
