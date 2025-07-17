import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  addSubCategories,
  updateCategory,      // new API call for updating category
  deleteSubCategory,   // new API call for deleting subcategory
  updateSubCategory,   // new API call for updating subcategory
  uploadImage,         // new API call for uploading images
} from "../api/categoryApi";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // For new category form
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newSubCategories, setNewSubCategories] = useState(""); // CSV input

  // For adding subcategories dynamically
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCatInputs, setNewSubCatInputs] = useState([
    { title: "", thumbnail: null, preview: null },
  ]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  // ======= CREATE NEW CATEGORY WITH CSV SUBCATEGORIES =======
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

  // ======= DELETE CATEGORY =======
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch {
      setError("Failed to delete category.");
    }
  };

  // ======= INLINE EDIT CATEGORY TITLE =======
  const handleCategoryTitleChange = (id, newTitle) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === id ? { ...cat, title: newTitle } : cat))
    );
  };

  const saveCategoryTitle = async (id, title) => {
    try {
      await updateCategory(id, { title });
      setError("");
    } catch {
      setError("Failed to update category title.");
    }
  };

  // ======= ADD SUBCATEGORY INPUTS DYNAMICALLY =======
  const handleAddSubInput = () => {
    setNewSubCatInputs((prev) => [...prev, { title: "", thumbnail: null, preview: null }]);
  };

  // Remove one subcategory input row
  const handleRemoveSubInput = (index) => {
    setNewSubCatInputs((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle subcategory input change (title)
  const handleSubInputChange = (index, value) => {
    setNewSubCatInputs((prev) => {
      const copy = [...prev];
      copy[index].title = value;
      return copy;
    });
  };

  // Handle thumbnail file selection
  const handleSubThumbnailChange = async (index, file) => {
    if (!file) return;
    // Create preview URL for UI
    const preview = URL.createObjectURL(file);

    setNewSubCatInputs((prev) => {
      const copy = [...prev];
      copy[index].thumbnail = file;
      copy[index].preview = preview;
      return copy;
    });
  };

  // ======= UPLOAD SUBCATEGORIES TO SELECTED CATEGORY =======
  const handleUploadSubcategories = async () => {
    if (!selectedCategoryId) {
      setError("Select a category first.");
      return;
    }

    // Filter out empty titles
    const validSubs = newSubCatInputs.filter((sub) => sub.title.trim() !== "");

    if (validSubs.length === 0) {
      setError("Enter at least one valid subcategory.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload thumbnails one by one (if any)
      const uploadedSubs = await Promise.all(
        validSubs.map(async (sub) => {
          let thumbnailUrl = null;
          if (sub.thumbnail) {
            // uploadImage should return URL string
            thumbnailUrl = await uploadImage(sub.thumbnail);
          }
          return { title: sub.title.trim(), thumbnail: thumbnailUrl };
        })
      );

      // Add subcategories to backend
      const updatedCategory = await addSubCategories(selectedCategoryId, uploadedSubs);

      // Update local state with updated category
      setCategories((prev) =>
        prev.map((cat) => (cat._id === selectedCategoryId ? updatedCategory : cat))
      );

      // Reset input
      setNewSubCatInputs([{ title: "", thumbnail: null, preview: null }]);
      setError("");
    } catch {
      setError("Failed to upload subcategories.");
    } finally {
      setLoading(false);
    }
  };

  // ======= INLINE EDIT SUBCATEGORY =======
  const handleSubCategoryTitleChange = (catId, subIndex, newTitle) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat._id !== catId) return cat;
        const newSubs = [...cat.subCategories];
        newSubs[subIndex].title = newTitle;
        return { ...cat, subCategories: newSubs };
      })
    );
  };

  const saveSubCategoryTitle = async (catId, subId, newTitle) => {
    try {
      await updateSubCategory(catId, subId, { title: newTitle });
      setError("");
    } catch {
      setError("Failed to update subcategory title.");
    }
  };

  // ======= DELETE SUBCATEGORY =======
  const handleDeleteSubCategory = async (catId, subId) => {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      const updatedCategory = await deleteSubCategory(catId, subId);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === catId ? updatedCategory : cat))
      );
      setError("");
    } catch {
      setError("Failed to delete subcategory.");
    }
  };

  // ======= RENDER =======
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* New Category Form */}
      <form onSubmit={handleAddCategory} className="mb-8 space-y-3">
        <input
          type="text"
          placeholder="New Category Title"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Subcategories (comma separated, optional)"
          value={newSubCategories}
          onChange={(e) => setNewSubCategories(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Add Category
        </button>
      </form>

      {/* Add Subcategories to existing category */}
      <div className="mb-8 border p-4 rounded space-y-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Add Subcategories to Existing Category</h2>

        <select
          className="border p-2 rounded w-full mb-3"
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          disabled={loading}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        {newSubCatInputs.map((sub, idx) => (
          <div key={idx} className="flex gap-3 items-center mb-3">
            <input
              type="text"
              placeholder="Subcategory Title"
              value={sub.title}
              onChange={(e) => handleSubInputChange(idx, e.target.value)}
              className="border p-2 rounded flex-grow"
              disabled={loading}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSubThumbnailChange(idx, e.target.files[0])}
              disabled={loading}
            />
            {sub.preview && (
              <img
                src={sub.preview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded"
              />
            )}
            {newSubCatInputs.length > 1 && (
              <button
                onClick={() => handleRemoveSubInput(idx)}
                type="button"
                className="text-red-600 font-bold text-xl"
                disabled={loading}
                title="Remove"
              >
                &times;
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSubInput}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          Add Another Subcategory Input
        </button>

        <button
          type="button"
          onClick={handleUploadSubcategories}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4"
          disabled={loading}
        >
          Save Subcategories
        </button>
      </div>

      {/* Categories List with Inline Editing */}
      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-6">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="border p-4 rounded bg-white shadow-sm"
            >
              {/* Editable Category Title */}
              <EditableText
                text={cat.title}
                onChange={(newTitle) => handleCategoryTitleChange(cat._id, newTitle)}
                onSave={(newTitle) => saveCategoryTitle(cat._id, newTitle)}
              />

              <button
                onClick={() => handleDeleteCategory(cat._id)}
                className="text-red-600 hover:underline mt-2"
              >
                Delete Category
              </button>

              {/* Subcategories List */}
              {cat.subCategories && cat.subCategories.length > 0 && (
                <ul className="mt-4 ml-6 list-disc list-inside">
                  {cat.subCategories.map((subCat, i) => (
                    <li key={subCat._id || i} className="flex items-center gap-3">
                      <EditableText
                        text={subCat.title}
                        onChange={(newTitle) =>
                          handleSubCategoryTitleChange(cat._id, i, newTitle)
                        }
                        onSave={(newTitle) =>
                          saveSubCategoryTitle(cat._id, subCat._id, newTitle)
                        }
                      />
                      {subCat.thumbnail && (
                        <img
                          src={subCat.thumbnail}
                          alt="thumbnail"
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <button
                        onClick={() => handleDeleteSubCategory(cat._id, subCat._id)}
                        className="text-red-600 hover:underline ml-auto"
                      >
                        Delete
                      </button>
                    </li>
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

// ======= Inline Editable Text Component =======
function EditableText({ text, onChange, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const save = () => {
    if (value.trim() && value !== text) {
      onSave(value.trim());
    }
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      autoFocus
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          save();
        } else if (e.key === "Escape") {
          setValue(text);
          setIsEditing(false);
        }
      }}
      className="border p-1 rounded w-full"
    />
  ) : (
    <h3
      onClick={() => setIsEditing(true)}
      className="text-xl font-semibold cursor-pointer hover:underline"
      title="Click to edit"
    >
      {text}
    </h3>
  );
}
