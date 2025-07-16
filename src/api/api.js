// src/api.js

import axios from "axios";

// ✅ Centralize your backend URL in one place
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Fetch all products
export const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/products`);
    return res.data; // Return only the data part
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    throw err; // Propagate error to caller
  }
};

// Submit a review for a product
export const submitReview = async (productId, review) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/reviews`, {
      productId,
      ...review,
    });
    return res.data; // Return the response data
  } catch (err) {
    console.error("❌ Error submitting review:", err);
    throw err;
  }
};
