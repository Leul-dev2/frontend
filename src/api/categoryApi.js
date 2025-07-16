import axios from "./axiosInstance";

// Get all categories (unchanged)
export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

// Create a new category WITH optional subCategories
export const createCategory = async (category) => {
  // category should be an object like:
  // {
  //   title: "Women’s",
  //   image: "url",
  //   subCategories: [{ title: "Dresses", thumbnail: "url" }, ...]
  // }
  const res = await axios.post("/categories", category);
  return res.data;
};

// Add subcategories to existing category
export const addSubCategories = async (categoryId, subCategories) => {
  // subCategories is an array of objects [{ title, thumbnail }, ...]
  const res = await axios.post(`/categories/${categoryId}/subcategories`, { subCategories });
  return res.data;
};

// Delete a category by ID (unchanged)
export const deleteCategory = async (id) => {
  await axios.delete(`/categories/${id}`);
};
