import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/productApi";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (sku) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(sku);
      fetchProducts(); // Refresh list after deletion
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.sku}>
              <td className="p-2 border">{p.sku}</td>
              <td className="p-2 border">{p.title}</td>
              <td className="p-2 border">${p.price}</td>
              <td className="p-2 border space-x-2">
                <Link
                  to={`/products/edit/${p.sku}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.sku)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
