import axios from "./axiosInstance";

// Get all categories
export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

// Create a new category
export const createCategory = async (category) => {
  const res = await axios.post("/categories", category);
  return res.data;
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  await axios.delete(`/categories/${id}`);
};
