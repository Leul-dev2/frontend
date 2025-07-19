// api/reviewApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://backend-ecomm-jol4.onrender.com/api";

export const getPendingReviews = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/reviews/pending`);
    return res.data;  // Should return an array of pending reviews
  } catch (error) {
    console.error("❌ Error fetching pending reviews:", error);
    throw error;
  }
};
