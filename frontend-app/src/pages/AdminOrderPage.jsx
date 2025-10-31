import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderService from "../services/order.service";

const AdminOrderPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Allowed statuses for the dropdown
  const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  // Enforce Admin and Authentication
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // --- Data Fetching Logic ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error loading all orders:", err);
      setError(err.message || "Could not load all orders.");
    } finally {
      setLoading(false);
    }
  };

  // --- Status Update Handler ---
  const handleStatusChange = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to change order #${orderId} status to ${newStatus}?`
      )
    ) {
      // Revert the dropdown display if the user cancels the action
      fetchOrders();
      return;
    }

    try {
      // Update the backend
      const response = await OrderService.updateOrderStatus(orderId, newStatus);

      // Optimistically update the local state with the new order data
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? response.order : order
        )
      );
      alert(`Success: ${response.message}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
      // Re-fetch orders on failure to ensure data integrity
      fetchOrders();
    }
  };

  // --- Helper Functions ---

  const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine the color for the status dropdown/pill
  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default: // Pending
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  // --- Render Logic ---

  if (loading)
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading all customer orders...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-600">{error}</div>
    );

  return (
    <div className="py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        📋 All Customer Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg shadow">
          <p className="text-xl text-gray-600">
            No orders have been placed yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ship To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </td>

                  {/* --- Status Dropdown for Editing --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`block w-full py-1 px-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {allowedStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-500 max-w-xs overflow-hidden truncate">
                    {order.shippingAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;
