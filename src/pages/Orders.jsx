import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../api/orderApi";

function StatusDropdown({ currentStatus, onChange, disabled }) {
  const options = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-1 bg-white"
      disabled={disabled}
    >
      {options.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOrders();
      const ordersWithId = data.map((order) => ({
        ...order,
        id: order._id || order.id,
      }));
      setOrders(ordersWithId);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    setUpdatingOrderId(orderId);
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      alert("Order deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Orders</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded shadow">
          {error}{" "}
          <button
            onClick={fetchOrders}
            className="underline text-blue-600 hover:text-blue-800 ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : !orders.length ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-700">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Paid</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Estimated Delivery</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customerName = `${order.shippingAddress?.firstName || ""} ${
                  order.shippingAddress?.lastName || ""
                }`.trim() || "N/A";

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{order.id}</td>
                    <td className="p-2 border font-medium">{customerName}</td>
                    <td className="p-2 border">
                      {order.isPaid ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="p-2 border">${order.total?.toFixed(2) || "0.00"}</td>
                    <td className="p-2 border">{formatTimestamp(order.createdAt)}</td>
                    <td className="p-2 border">{formatTimestamp(order.estimatedDelivery)}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border flex gap-2">
                      <StatusDropdown
                        currentStatus={order.status}
                        onChange={(newStatus) =>
                          handleStatusChange(order.id, newStatus)
                        }
                        disabled={updatingOrderId === order.id}
                      />
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={updatingOrderId === order.id}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        title="Delete Order"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
