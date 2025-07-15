import axios from "axios";

const API_BASE_URL = "https://backend-ecomm-jol4.onrender.com/api"; // or your deployed backend

// Get all products
const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/products`);
    console.log(res.data);
  } catch (err) {
    console.error("Error fetching products:", err.message);
  }
};

// Create a review (example POST)
const submitReview = async (productId, review) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/reviews`, {
      productId,
      ...review
    });
    console.log(res.data);
  } catch (err) {
    console.error("Error submitting review:", err.message);
  }
};
