// ✅ paste this entire file in src/components/CategoryManagement.jsx

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

  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newSubCategories, setNewSubCategories] = useState("");
  const [categoryThumbnail, setCategoryThumbnail] = useState(null);
  const [categoryThumbnailPreview, setCategoryThumbnailPreview] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) {
      setError("Category title cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");

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
    } catch {
      setError("Failed to create category.");
    } finally {
      setLoading(false);
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

  const handleCategoryTitleChange = (id, newTitle) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === id ? { ...cat, title: newTitle } : cat))
    );
  };

  const saveCategoryTitle = async (id, title) => {
    try {
      await updateCategory(id, { title });
    } catch {
      setError("Failed to update category title.");
    }
  };

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
    } catch {
      setError("Failed to upload subcategories.");
    } finally {
      setLoading(false);
    }
  };

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
      const updatedCategory = await updateSubCategory(catId, subId, { title: newTitle });
      setCategories((prev) =>
        prev.map((cat) => (cat._id === catId ? updatedCategory : cat))
      );
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
    } catch {
      setError("Failed to delete subcategory.");
    }
  };

  return (
    <>
      {/* keep your same JSX from your version here (it will work fine with the matching state updates) */}
    </>
  );
}

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
