import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { getOrders } from "../api/orderApi";
import { getPendingReviews } from "../api/reviewApi";
import { getUsersCount } from "../api/userApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, orders, users, reviews] = await Promise.all([
          getProducts(),
          getOrders(),
          getUsersCount(),
          getPendingReviews(),
        ]);

        setProductCount(products.length);
        setOrderCount(orders.length);
        setCustomerCount(users.count);
        setPendingReviewCount(reviews.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { label: "Total Products", value: productCount },
    { label: "Active Orders", value: orderCount },
    { label: "Customers", value: customerCount },
    { label: "Pending Reviews", value: pendingReviewCount },
  ];

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
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

      <section className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={stats.map(({ label, value }) => ({ name: label, count: value }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
