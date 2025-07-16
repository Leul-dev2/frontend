import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  addSubCategories,
} from "../api/categoryApi";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newSubCategories, setNewSubCategories] = useState(""); // comma separated subcategories input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCatInput, setNewSubCatInput] = useState("");

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle add new category (with optional subcategories)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) {
      setError("Category title cannot be empty.");
      return;
    }

    const subCategoriesArray = newSubCategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title) => ({ title }));

    try {
      const createdCategory = await createCategory({
        title: newCategoryTitle,
        subCategories: subCategoriesArray,
      });
      setCategories((prev) => [...prev, createdCategory]);
      setNewCategoryTitle("");
      setNewSubCategories("");
      setError("");
    } catch {
      setError("Failed to create category.");
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch {
      setError("Failed to delete category.");
    }
  };

  // Handle add subcategory to existing category
  const handleAddSubCategory = async () => {
    if (!selectedCategoryId || !newSubCatInput.trim()) {
      setError("Select a category and enter a subcategory title.");
      return;
    }

    try {
      const updatedCategory = await addSubCategories(selectedCategoryId, [
        { title: newSubCatInput.trim() },
      ]);

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCategoryId ? updatedCategory : cat
        )
      );
      setNewSubCatInput("");
      setError("");
    } catch {
      setError("Failed to add subcategory.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6 flex flex-col gap-2">
        <input
          type="text"
          placeholder="New Category Title"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subcategories (comma separated, optional)"
          value={newSubCategories}
          onChange={(e) => setNewSubCategories(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Add Category
        </button>
      </form>

      {/* Add Subcategory Form */}
      <div className="mb-6 flex gap-2 items-center">
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="border p-2 rounded flex-grow"
        >
          <option value="" disabled>
            Select Category to Add Subcategory
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Subcategory Title"
          value={newSubCatInput}
          onChange={(e) => setNewSubCatInput(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={handleAddSubCategory}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Add Subcategory
        </button>
      </div>

      {/* Categories List */}
      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="border p-3 rounded"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{cat.title}</span>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              {cat.subCategories && cat.subCategories.length > 0 && (
                <ul className="mt-2 ml-4 list-disc list-inside text-gray-700">
                  {cat.subCategories.map((subCat, i) => (
                    <li key={i}>{subCat.title}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
