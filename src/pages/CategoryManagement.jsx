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
    if (!newCategoryTitle.trim()) return setError("Enter a title");

    setLoading(true);
    try {
      let thumbnailUrl = null;
      if (categoryThumbnail) {
        thumbnailUrl = await uploadImage(categoryThumbnail);
      }
      const subCategoriesArray = newSubCategories.split(",").map(s => s.trim()).filter(Boolean).map(title => ({ title }));

      const created = await createCategory({ title: newCategoryTitle, thumbnail: thumbnailUrl, subCategories: subCategoriesArray });
      setCategories(prev => [...prev, created]);

      setNewCategoryTitle("");
      setNewSubCategories("");
      setCategoryThumbnail(null);
      setCategoryThumbnailPreview(null);
    } catch {
      setError("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteCategory(id);
    setCategories(prev => prev.filter(cat => cat._id !== id));
  };

  const handleCategoryTitleChange = (id, newTitle) => {
    setCategories(prev =>
      prev.map(cat => (cat._id === id ? { ...cat, title: newTitle } : cat))
    );
  };

  const saveCategoryTitle = async (id, title) => {
    const updated = await updateCategory(id, { title });
    setCategories(prev => prev.map(cat => (cat._id === id ? updated : cat)));
  };

  const handleAddSubInput = () => {
    setNewSubCatInputs(prev => [...prev, { title: "", thumbnail: null, preview: null }]);
  };

  const handleRemoveSubInput = (index) => {
    setNewSubCatInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubInputChange = (index, value) => {
    setNewSubCatInputs(prev => {
      const copy = [...prev];
      copy[index].title = value;
      return copy;
    });
  };

  const handleSubThumbnailChange = (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setNewSubCatInputs(prev => {
      const copy = [...prev];
      copy[index].thumbnail = file;
      copy[index].preview = preview;
      return copy;
    });
  };

  const handleUploadSubcategories = async () => {
    if (!selectedCategoryId) return setError("Select category");
    const valid = newSubCatInputs.filter(sub => sub.title.trim());
    if (valid.length === 0) return setError("Add at least one subcategory");

    setLoading(true);
    try {
      const uploadedSubs = await Promise.all(
        valid.map(async sub => {
          let url = null;
          if (sub.thumbnail) {
            url = await uploadImage(sub.thumbnail);
          }
          return { title: sub.title, thumbnail: url };
        })
      );
      const updated = await addSubCategories(selectedCategoryId, uploadedSubs);
      setCategories(prev => prev.map(cat => (cat._id === selectedCategoryId ? updated : cat)));
      setNewSubCatInputs([{ title: "", thumbnail: null, preview: null }]);
    } catch {
      setError("Failed to upload subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryTitleChange = (catId, subIndex, newTitle) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat._id !== catId) return cat;
        const newSubs = [...cat.subCategories];
        newSubs[subIndex].title = newTitle;
        return { ...cat, subCategories: newSubs };
      })
    );
  };

  const saveSubCategoryTitle = async (catId, subId, newTitle) => {
    const updated = await updateSubCategory(catId, subId, { title: newTitle });
    setCategories(prev => prev.map(cat => (cat._id === catId ? updated : cat)));
  };

  const handleDeleteSubCategory = async (catId, subId) => {
    if (!window.confirm("Delete subcategory?")) return;
    const updated = await deleteSubCategory(catId, subId);
    setCategories(prev => prev.map(cat => (cat._id === catId ? updated : cat)));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* --- Your UI stays unchanged, keep your form and lists exactly as they are --- */}
      {/* ✅ Just keep your EditableText, forms, buttons — no change needed */}
    </div>
  );
}

function EditableText({ text, onChange, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  useEffect(() => { setValue(text); }, [text]);
  const save = () => { if (value.trim()) onSave(value); setIsEditing(false); };
  return isEditing ? (
    <span className="flex gap-2">
      <input value={value} onChange={e => { setValue(e.target.value); onChange(e.target.value); }} />
      <button onClick={save}>Save</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </span>
  ) : (
    <span onClick={() => setIsEditing(true)}>{text}</span>
  );
}
