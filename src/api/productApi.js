import axios from "./axiosInstance";

// Get all products (optionally filter by category title)
export const getProducts = async (categoryTitle) => {
  const url = categoryTitle 
    ? `/products?category=${encodeURIComponent(categoryTitle)}`
    : `/products`;
  const res = await axios.get(url);
  return res.data;
};

// Get single product by SKU
export const getProduct = async (sku) => {
  const res = await axios.get(`/products/${sku}`);
  return res.data;
};

// Create product — IMPORTANT: make sure to pass categoryTitle in productData
export const createProduct = async (productData) => {
  const res = await axios.post("/products", productData);
  return res.data;
};

// Update product — pass new categoryTitle if needed
export const updateProduct = async (sku, productData) => {
  const res = await axios.put(`/products/${sku}`, productData);
  return res.data;
};

// Delete product by SKU
export const deleteProduct = async (sku) => {
  await axios.delete(`/products/${sku}`);
};
