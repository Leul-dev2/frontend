import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/productApi";

export default function AddProduct() {
  const [form, setForm] = useState({
    sku: "",
    title: "",
    brandName: "",
    image: "",
    price: "",
    priceAfterDiscount: "",
    discountPercent: "",
    description: "",
    rating: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Convert numbers where needed
      const productData = {
        ...form,
        price: parseFloat(form.price),
        priceAfterDiscount: parseFloat(form.priceAfterDiscount) || undefined,
        discountPercent: parseFloat(form.discountPercent) || undefined,
        rating: parseFloat(form.rating) || undefined,
      };
      await createProduct(productData);
      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to add product");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="brandName"
          placeholder="Brand Name"
          value={form.brandName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="priceAfterDiscount"
          placeholder="Price After Discount"
          value={form.priceAfterDiscount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="discountPercent"
          placeholder="Discount Percent"
          value={form.discountPercent}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          max="100"
          step="0.01"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          max="5"
          step="0.1"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
