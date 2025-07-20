import axios from "axios";

// Backend base URL for chat APIs
const BASE_URL = process.env.REACT_APP_API_URL || "https://backend-ecomm-jol4.onrender.com/api/chats";

const adminChatApi = {
  // Fetch all chats
  fetchAllChats: async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data; // array of chat objects
  },

  // Fetch messages for a specific chat ID
  fetchMessages: async (chatId) => {
    if (!chatId) throw new Error("chatId is required");
    const response = await axios.get(`${BASE_URL}/${chatId}/messages`);
    return response.data; // array of message objects
  },

  // Send a reply message as admin for a specific chat ID
  sendAdminReply: async (chatId, message) => {
    if (!chatId) throw new Error("chatId is required");
    if (!message || message.trim() === "") throw new Error("message cannot be empty");
    const response = await axios.post(`${BASE_URL}/${chatId}/messages`, { message });
    return response.data; // expected response: { status: "Message sent" }
  },
};

export default adminChatApi;
