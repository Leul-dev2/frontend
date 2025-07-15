import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { getOrders } from "../api/orderApi";

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProductCount(data.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrderCount(data.length); // ✅ uses your existing API
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const stats = [
    { label: "Total Products", value: productCount },
    { label: "Active Orders", value: orderCount },
    { label: "Customers", value: 245 }, // Hook up real data later
    { label: "Pending Reviews", value: 7 }, // Hook up real data later
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(({ label, value }) => (
          <article
            key={label}
            className="bg-white shadow rounded p-6 flex flex-col items-center"
          >
            <span className="text-4xl font-extrabold text-blue-600">{value}</span>
            <h2 className="mt-2 text-gray-600 text-lg font-medium">{label}</h2>
          </article>
        ))}
      </section>
    </div>
  );
}
