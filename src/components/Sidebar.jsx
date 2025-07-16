import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-lg p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-blue-700">Admin Panel</h1>
      <nav className="flex flex-col gap-4 flex-grow">
        <Link to="/dashboard" className="hover:bg-blue-100 px-4 py-2 rounded transition">
          Dashboard
        </Link>
        <Link to="/products" className="hover:bg-blue-100 px-4 py-2 rounded transition">
          Products
        </Link>
           <Link to="/products" className="hover:bg-blue-100 px-4 py-2 rounded transition">
          CategoryManagement
        </Link>
        <Link to="/products/add" className="hover:bg-blue-100 px-4 py-2 rounded transition">
          Add Product
        </Link>
        <Link to="/orders" className="hover:bg-blue-100 px-4 py-2 rounded transition">
          Orders
        </Link>
        {localStorage.getItem("token") && (
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}
