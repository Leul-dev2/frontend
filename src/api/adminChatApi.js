// ✅ src/api/adminChatApi.js
import axios from "axios";

// ✅ CRA uses process.env.REACT_APP_*
const BASE_URL = process.env.REACT_APP_API_URL;

if (!BASE_URL) {
  throw new Error(
    "❌ BASE_URL is undefined — check your .env! Did you restart `npm start`?"
  );
}

console.log("✅ Using BASE_URL:", BASE_URL);

export const fetchAllChats = async () => {
  const res = await axios.get(`${BASE_URL}/chats/all`);
  return res.data; // Should be [] or { chats: [] }
};

export const fetchMessages = async (chatId) => {
  if (!chatId) throw new Error("❌ chatId is required");
  const res = await axios.get(`${BASE_URL}/chats/${chatId}/messages`);
  return res.data;
};

export const sendAdminReply = async (chatId, message) => {
  if (!chatId) throw new Error("❌ chatId is required");
  if (!message) throw new Error("❌ message is required");
  const res = await axios.post(`${BASE_URL}/chats/${chatId}/messages`, {
    message,
  });
  return res.data;
};
