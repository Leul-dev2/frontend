import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../api/productApi";
import { getCategories } from "../api/categoryApi";

export default function EditProduct() {
  const { sku } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState("");

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
          categoryTitle: product.category?.title || "",
          subcategoryTitle: product.subcategory?.title || "", // ✅ show subcategory!
        });

        setCategories(cats);
      } catch (err) {
        setError(err.message || "Failed to load data");
      }
    }
    fetchData();
  }, [sku]);

  // ✅ When category changes → update subcategories list
  useEffect(() => {
    if (!form?.categoryTitle) {
      setSubcategories([]);
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.title === form.categoryTitle
    );

    if (selectedCategory && selectedCategory.subCategories) {
      setSubcategories(selectedCategory.subCategories.map((s) => s.title));
    } else {
      setSubcategories([]);
    }
  }, [form?.categoryTitle, categories]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        rating:
          form.rating === "" ? undefined : parseFloat(form.rating),
      };

      await updateProduct(sku, productData);
      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to update");
    }
  };

  if (!form) return <div>Loading...</div>;

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
          className="w-full p-2 border rounded bg-gray-200"
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

        {subcategories.length > 0 && (
          <select
            name="subcategoryTitle"
            value={form.subcategoryTitle}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="priceAfterDiscount"
          placeholder="Price After Discount"
          value={form.priceAfterDiscount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="discountPercent"
          placeholder="Discount Percent"
          value={form.discountPercent}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
