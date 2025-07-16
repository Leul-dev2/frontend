import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../api/productApi";
import { getCategories } from "../api/categoryApi"; // ✅ import this!

export default function EditProduct() {
  const { sku } = useParams();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]); // ✅ store categories
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch product + categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [product, cats] = await Promise.all([
          getProduct(sku),
          getCategories(),
        ]);
        setForm({
          sku: product.sku,
          title: product.title,
          brandName: product.brandName,
          image: product.image,
          price: product.price,
          priceAfterDiscount: product.priceAfterDiscount || "",
          discountPercent: product.discountPercent || "",
          description: product.description || "",
          rating: product.rating || "",
          categoryTitle: product.category?.title || "", // ✅
        });
        setCategories(cats);
      } catch (err) {
        setError(err.message || "Failed to load product/categories");
      }
    }
    fetchData();
  }, [sku]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        priceAfterDiscount:
          form.priceAfterDiscount === "" ? undefined : parseFloat(form.priceAfterDiscount),
        discountPercent:
          form.discountPercent === "" ? undefined : parseFloat(form.discountPercent),
        rating: form.rating === "" ? undefined : parseFloat(form.rating),
      };
      await updateProduct(sku, productData);
      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to update product");
    }
  };

  if (!form) return <div>Loading product data...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {sku}</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="sku"
          value={form.sku}
          disabled
          className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
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

        {/* ✅ Category Select */}
        <select
          name="categoryTitle"
          value={form.categoryTitle}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>

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
          Update Product
        </button>
      </form>
    </div>
  );
}
