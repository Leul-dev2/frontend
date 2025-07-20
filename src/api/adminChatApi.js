// 📁 src/api/adminChatApi.js

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

console.log("BASE_URL:", BASE_URL); // ✅ This should log your Render URL

const adminChatApi = {
  getAllChats: async () => {
    const response = await axios.get(`${BASE_URL}/chats/all`);
    return response.data;
  },

  getChatMessages: async (chatId) => {
    if (!chatId) throw new Error("chatId required");
    const response = await axios.get(`${BASE_URL}/chats/${chatId}/messages`);
    return response.data;
  },

  sendAdminReply: async (chatId, message) => {
    if (!chatId) throw new Error("chatId required");
    const response = await axios.post(`${BASE_URL}/chats/${chatId}/messages`, { message });
    return response.data;
  },
};

export default adminChatApi;
