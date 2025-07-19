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

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCatInputs, setNewSubCatInputs] = useState([
    { title: "", thumbnail: null, preview: null },
  ]);

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

  // ======= Inline category editing =======
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

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch {
      setError("Failed to delete category.");
    }
  };

  // ======= Add subcategory input =======
  const handleAddSubInput = () => {
    setNewSubCatInputs((prev) => [...prev, { title: "", thumbnail: null, preview: null }]);
  };

  const handleRemoveSubInput = (index) => {
    setNewSubCatInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubInputChange = (index, value) => {
    setNewSubCatInputs((prev) => {
      const copy = [...prev];
      copy[index].title = value;
      return copy;
    });
  };

  const handleSubThumbnailChange = (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setNewSubCatInputs((prev) => {
      const copy = [...prev];
      copy[index].thumbnail = file;
      copy[index].preview = preview;
      return copy;
    });
  };

  // ======= Upload subcategories =======
  const handleUploadSubcategories = async () => {
    if (!selectedCategoryId) {
      setError("Select a category first.");
      return;
    }

    const validSubs = newSubCatInputs.filter((sub) => sub.title.trim() !== "");

    if (validSubs.length === 0) {
      setError("Enter at least one valid subcategory.");
      return;
    }

    setLoading(true);
    setError("");

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

      const updatedCategory = await addSubCategories(selectedCategoryId, uploadedSubs);

      setCategories((prev) =>
        prev.map((cat) => (cat._id === selectedCategoryId ? updatedCategory : cat))
      );

      setNewSubCatInputs([{ title: "", thumbnail: null, preview: null }]);
      setError("");
    } catch {
      setError("Failed to upload subcategories.");
    } finally {
      setLoading(false);
    }
  };

  // ======= Inline subcategory editing =======
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold">Category Management</h1>

      {error && <div className="text-red-600">{error}</div>}

      {/* Add Subcategories */}
      <div className="p-6 border rounded bg-white shadow space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Add Subcategories</h2>

        <select
          className="border p-2 rounded w-full"
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
          <div key={idx} className="flex gap-4 items-center">
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
                className="text-red-600 text-2xl font-bold"
                disabled={loading}
              >
                &times;
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleAddSubInput}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            Add More Inputs
          </button>

          <button
            type="button"
            onClick={handleUploadSubcategories}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Upload Subcategories
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="p-4 border rounded bg-white shadow space-y-2"
            >
              <div className="flex items-center gap-4">
                {cat.thumbnail && (
                  <img
                    src={cat.thumbnail}
                    alt="thumb"
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <EditableText
                  text={cat.title}
                  onChange={(newTitle) =>
                    handleCategoryTitleChange(cat._id, newTitle)
                  }
                  onSave={(newTitle) => saveCategoryTitle(cat._id, newTitle)}
                />
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-red-600 hover:underline ml-auto"
                >
                  Delete
                </button>
              </div>

              {cat.subCategories && cat.subCategories.length > 0 && (
                <ul className="ml-6 list-disc space-y-2">
                  {cat.subCategories.map((sub, i) => (
                    <li key={sub._id} className="flex items-center gap-3">
                      <EditableText
                        text={sub.title}
                        onChange={(newTitle) =>
                          handleSubCategoryTitleChange(cat._id, i, newTitle)
                        }
                        onSave={(newTitle) =>
                          saveSubCategoryTitle(cat._id, sub._id, newTitle)
                        }
                      />
                      {sub.thumbnail && (
                        <img
                          src={sub.thumbnail}
                          alt="thumb"
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <button
                        onClick={() => handleDeleteSubCategory(cat._id, sub._id)}
                        className="text-red-600 hover:underline ml-auto"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ======= EditableText Component =======
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

  const cancel = () => {
    setValue(text);
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        className="border p-1 rounded"
      />
      <button onClick={save} className="bg-blue-600 text-white px-2 rounded">
        Save
      </button>
      <button onClick={cancel} className="bg-gray-400 text-white px-2 rounded">
        Cancel
      </button>
    </div>
  ) : (
    <h3
      onClick={() => setIsEditing(true)}
      className="text-lg font-semibold cursor-pointer hover:underline"
    >
      {text}
    </h3>
  );
}
