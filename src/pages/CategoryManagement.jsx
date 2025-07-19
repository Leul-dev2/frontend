import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  addSubCategories,
  updateCategory,
  deleteSubCategory,
  updateSubCategory,
  uploadImage,
} from "../api/categoryApi";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newSubCategories, setNewSubCategories] = useState("");
  const [categoryThumbnail, setCategoryThumbnail] = useState(null);
  const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newSubCatInputs, setNewSubCatInputs] = useState([
    { id: Date.now(), title: "", thumbnail: null, preview: null },
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newCategoryTitle.trim()) {
      setError("Category title cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      let thumbnailUrl = null;
      if (categoryThumbnail) {
        thumbnailUrl = await uploadImage(categoryThumbnail);
      }

      const subCategoriesArray = newSubCategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((title) => ({ title }));

      const createdCategory = await createCategory({
        title: newCategoryTitle,
        thumbnail: thumbnailUrl,
        subCategories: subCategoriesArray,
      });

      setCategories((prev) => [...prev, createdCategory]);
      setNewCategoryTitle("");
      setNewSubCategories("");
      setCategoryThumbnail(null);
      setCategoryThumbnailPreview(null);
      setSuccess("Category created!");
    } catch (err) {
      console.error(err);
      setError("Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setSuccess("Category deleted.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete category.");
    }
  };

  const handleAddSubInput = () => {
    setNewSubCatInputs((prev) => [
      ...prev,
      { id: Date.now(), title: "", thumbnail: null, preview: null },
    ]);
  };

  const handleRemoveSubInput = (id) => {
    setNewSubCatInputs((prev) => prev.filter((sub) => sub.id !== id));
  };

  const handleSubInputChange = (id, value) => {
    setNewSubCatInputs((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, title: value } : sub))
    );
  };

  const handleSubThumbnailChange = (id, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setNewSubCatInputs((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, thumbnail: file, preview } : sub
      )
    );
  };

  const handleUploadSubcategories = async () => {
    if (!selectedCategoryId) {
      setError("Please select a category first.");
      return;
    }

    const validSubs = newSubCatInputs.filter((sub) => sub.title.trim() !== "");
    if (validSubs.length === 0) {
      setError("Add at least one valid subcategory.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const uploadedSubs = await Promise.all(
        validSubs.map(async (sub) => {
          let thumbnailUrl = null;
          if (sub.thumbnail) {
            thumbnailUrl = await uploadImage(sub.thumbnail);
          }
          return { title: sub.title.trim(), thumbnail: thumbnailUrl };
        })
      );

      const updatedCategory = await addSubCategories(
        selectedCategoryId,
        uploadedSubs
      );
      setCategories((prev) =>
        prev.map((cat) => (cat._id === selectedCategoryId ? updatedCategory : cat))
      );

      setNewSubCatInputs([{ id: Date.now(), title: "", thumbnail: null, preview: null }]);
      setSuccess("Subcategories saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save subcategories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Category Management</h1>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* New Category Form */}
      <form
        onSubmit={handleAddCategory}
        className="space-y-4 border p-6 rounded bg-white shadow"
      >
        <h2 className="text-xl font-semibold">Create New Category</h2>
        <input
          type="text"
          placeholder="Category title"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Subcategories (comma separated)"
          value={newSubCategories}
          onChange={(e) => setNewSubCategories(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setCategoryThumbnail(file);
              setCategoryThumbnailPreview(URL.createObjectURL(file));
            }
          }}
        />
        {categoryThumbnailPreview && (
          <img
            src={categoryThumbnailPreview}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Category
        </button>
      </form>

      {/* Add Subcategories */}
      <div className="space-y-4 border p-6 rounded bg-white shadow">
        <h2 className="text-xl font-semibold">Add Subcategories</h2>

        <select
          className="border p-2 w-full rounded"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        {newSubCatInputs.map((sub) => (
          <div key={sub.id} className="flex flex-col md:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Subcategory Title"
              value={sub.title}
              onChange={(e) => handleSubInputChange(sub.id, e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleSubThumbnailChange(sub.id, e.target.files[0])
              }
            />
            {sub.preview && (
              <img
                src={sub.preview}
                alt="preview"
                className="w-12 h-12 object-cover rounded"
              />
            )}
            {newSubCatInputs.length > 1 && (
              <button
                onClick={() => handleRemoveSubInput(sub.id)}
                className="text-red-600 text-xl"
              >
                ✖
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddSubInput}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add More
        </button>

        <button
          onClick={handleUploadSubcategories}
          disabled={loading || !selectedCategoryId}
          className={`block w-full md:w-auto mt-4 bg-blue-700 text-white px-6 py-3 rounded ${
            loading || !selectedCategoryId ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"
          }`}
        >
          ✅ Save Subcategories
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat._id} className="border p-4 rounded bg-white shadow space-y-2">
            <div className="flex items-center gap-4">
              {cat.thumbnail && (
                <img
                  src={cat.thumbnail}
                  alt="thumb"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <span className="font-semibold">{cat.title}</span>
              <button
                onClick={() => handleDeleteCategory(cat._id)}
                className="text-red-600 ml-auto"
              >
                Delete
              </button>
            </div>

            {cat.subCategories?.length > 0 && (
              <ul className="ml-6 list-disc">
                {cat.subCategories.map((sub) => (
                  <li key={sub._id} className="flex items-center gap-3">
                    {sub.title}
                    {sub.thumbnail && (
                      <img
                        src={sub.thumbnail}
                        alt="sub thumb"
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
