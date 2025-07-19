import axios from "axios";

// Base URL for your backend API (set REACT_APP_API_URL in your .env)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/products`);
    return res.data; // Expecting array of products
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    throw err;
  }
};

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/orders`);
    return res.data; // Expecting array of orders
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    throw err;
  }
};

// Fetch total user count or list of users (adjust backend accordingly)
export const fetchUsersCount = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/count`);
    return res.data; // Expected { count: number }
  } catch (err) {
    console.error("❌ Error fetching users count:", err);
    throw err;
  }
};

// Fetch pending reviews (adjust endpoint on backend accordingly)
export const fetchPendingReviews = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/reviews/pending`);
    return res.data; // Expecting array of pending reviews
  } catch (err) {
    console.error("❌ Error fetching pending reviews:", err);
    throw err;
  }
};

// Submit a new review for a product
export const submitReview = async (productId, review) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/products/${productId}/reviews`, review);
    return res.data;
  } catch (err) {
    console.error("❌ Error submitting review:", err);
    throw err;
  }
};
