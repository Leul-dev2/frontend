import axios from "./axiosInstance";

export const getProducts = async () => {
  const res = await axios.get("/products");
  return res.data;
};

export const getProduct = async (sku) => {
  const res = await axios.get(`/products/${sku}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await axios.post("/products", productData);
  return res.data;
};

export const updateProduct = async (sku, productData) => {
  const res = await axios.put(`/products/${sku}`, productData);
  return res.data;
};

export const deleteProduct = async (sku) => {
  await axios.delete(`/products/${sku}`);
};
