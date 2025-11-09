// frontend-app/src/pages/OrderHistoryPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderService from "../services/order.service";

const OrderHistoryPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

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

  // Pagination calculations
  const totalItems = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  // Get current page orders
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return orders.slice(start, start + perPage);
  }, [orders, currentPage, perPage]);

  // Page navigation
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
          Order History
        </h1>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            Showing {orders.length > 0 ? (currentPage - 1) * perPage + 1 : 0}-
            {Math.min(currentPage * perPage, totalItems)} of {totalItems}
          </span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center p-6 sm:p-10 bg-gray-50 rounded-lg shadow">
          <p className="text-lg sm:text-xl text-gray-600">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 sm:space-y-6">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border-t-4 border-yellow-500"
              >
                {/* Order Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-100 mb-4 gap-2 sm:gap-4">
                  <div className="flex justify-between sm:block">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                      ORDER PLACED
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-700">
                      {formatOrderDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                      ORDER #
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-700">
                      {order.id}
                    </span>
                  </div>
                  <div
                    className={`text-base sm:text-lg font-bold ${
                      order.status === "Pending"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Order Details - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-gray-800">Total</h3>
                    <p className="text-xl sm:text-2xl text-yellow-600 font-extrabold">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-gray-800">Ship To</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {order.shippingAddress}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-gray-800">Payment</h3>
                    <p className="text-sm text-gray-600">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Navigation */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 text-sm hover:bg-gray-50"
              >
                « First
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 text-sm hover:bg-gray-50"
              >
                Previous
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 text-sm hover:bg-gray-50"
              >
                Next
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 text-sm hover:bg-gray-50"
              >
                Last »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
