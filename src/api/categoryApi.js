import axios from "./axiosInstance";

export const getCategories = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await axios.post("/categories", categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  await axios.delete(`/categories/${id}`);
};
