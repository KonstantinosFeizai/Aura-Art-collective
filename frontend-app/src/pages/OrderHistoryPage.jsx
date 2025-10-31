// frontend-app/src/pages/OrderHistoryPage.jsx

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderService from "../services/order.service";

const OrderHistoryPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return; // don't fetch until authenticated

    let cancelled = false;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // pass user id if your API requires it: OrderService.getOrderHistory(currentUser?.id)
        const data = await OrderService.getOrderHistory();
        if (!cancelled) setOrders(data || []);
      } catch (err) {
        if (!cancelled)
          setError(err?.message || "Could not load order history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, currentUser?.id]);

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading)
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading your order history...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-600">{error}</div>
    );

  const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Order History for {currentUser?.username}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg shadow">
          <p className="text-xl text-gray-600">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 shadow-xl rounded-lg border-t-4 border-yellow-500"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    ORDER PLACED
                  </span>
                  <span className="font-semibold text-gray-700">
                    {formatOrderDate(order.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    ORDER #
                  </span>
                  <span className="font-semibold text-gray-700">
                    {order.id}
                  </span>
                </div>
                <div
                  className={`text-lg font-bold ${
                    order.status === "Pending"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-bold text-gray-800">Total</h3>
                  <p className="text-2xl text-yellow-600 font-extrabold">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Ship To</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {order.shippingAddress}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Payment</h3>
                  <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                </div>
              </div>

              {/* Note: We don't have OrderItem details, so we can't list products, 
                                but this structure is ready for it. */}
              <p className="mt-4 text-sm text-gray-500">
                (Product details are not displayed here as the backend is not
                yet storing itemized order lines.)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
