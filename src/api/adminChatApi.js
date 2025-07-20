import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://backend-ecomm-jol4.onrender.com/api";

const adminChatApi = {
  // Fetch all chats
  fetchAllChats: async () => {
    const response = await axios.get(`${BASE_URL}/chats/all`);
    return response.data;
  },

  // Fetch messages for a specific chat ID
  fetchMessages: async (chatId) => {
    if (!chatId) throw new Error("chatId is required");
    const response = await axios.get(`${BASE_URL}/chats/${chatId}/messages`);
    return response.data;
  },

  // Send a reply message as admin for a specific chat ID
  sendAdminReply: async (chatId, message) => {
    if (!chatId) throw new Error("chatId is required");
    if (!message || message.trim() === "") throw new Error("message cannot be empty");
    const response = await axios.post(`${BASE_URL}/chats/${chatId}/messages`, { message });
    return response.data;
  },
};

export default adminChatApi;
