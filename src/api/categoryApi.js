import axios from "./axiosInstance";

// Get all categories
export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

// Create a new category with optional subCategories and image
export const createCategory = async (category) => {
  // category example:
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

// Delete a category by ID
export const deleteCategory = async (id) => {
  await axios.delete(`/categories/${id}`);
};

// Update category by ID (e.g., update title, image)
export const updateCategory = async (id, updateData) => {
  // updateData example: { title: "New Title", image: "newImageUrl" }
  const res = await axios.put(`/categories/${id}`, updateData);
  return res.data;
};

// Update a subcategory title or thumbnail
export const updateSubCategory = async (categoryId, subCategoryId, updateData) => {
  // updateData example: { title: "New Subcategory", thumbnail: "newThumbnailUrl" }
  const res = await axios.put(`/categories/${categoryId}/subcategories/${subCategoryId}`, updateData);
  return res.data;
};

// Delete a subcategory from a category
export const deleteSubCategory = async (categoryId, subCategoryId) => {
  const res = await axios.delete(`/categories/${categoryId}/subcategories/${subCategoryId}`);
  return res.data;
};

// Upload image file and get URL back (for thumbnails or category images)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url; // assuming backend returns { url: "uploaded_image_url" }
};
