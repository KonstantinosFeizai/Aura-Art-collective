// frontend-app/src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from "react";
import AdminService from "../services/admin.service"; // Import the new service
import { useAuth } from "../context/AuthContext"; // To get the user's token
import { Link } from "react-router-dom"; // Make sure Link is imported

const AdminDashboardPage = () => {
  // Assume useAuth provides a currentUser object with an accessToken property
  const { currentUser } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpis = async () => {
      // Check for valid token before attempting to fetch admin data
      if (!currentUser || !currentUser.accessToken) {
        setError("Authentication required for dashboard access.");
        setLoading(false);
        return;
      }

      try {
        const data = await AdminService.getKpiMetrics(currentUser.accessToken);
        setKpis(data);
      } catch (err) {
        console.error("KPI Fetch Error:", err);
        setError(
          "Failed to fetch dashboard data. Check backend connection and user permissions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [currentUser]);

  if (loading)
    return <div className="p-6 text-center">Loading dashboard metrics...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;
  if (!kpis)
    return (
      <div className="p-6 text-gray-500 text-center">No data available.</div>
    );

  const kpiCards = [
    {
      title: "Total Sales",
      value: `$${kpis.totalSales}`,
      color: "bg-green-500",
    },
    { title: "Total Orders", value: kpis.totalOrders, color: "bg-blue-500" },
    {
      title: "Total Products",
      value: kpis.totalProducts,
      color: "bg-yellow-500",
    },
    {
      title: "Last Order Update",
      value: kpis.latestOrderDate
        ? new Date(kpis.latestOrderDate).toLocaleDateString()
        : "N/A",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Dashboard Overview
      </h1>

      {/* KPI Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl text-white shadow-xl transform transition-all hover:scale-[1.02] ${card.color}`}
          >
            <p className="text-lg font-medium opacity-90">{card.title}</p>
            <p className="text-4xl font-extrabold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-800">
        Quick Actions
      </h2>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/admin/products"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition duration-150 font-medium"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/add"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 font-medium"
        >
          + Add New Product
        </Link>
        {/* --- NEW BUTTON ADDED --- */}
        <Link
          to="/admin/messages"
          className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 transition duration-150 font-medium"
        >
          View Messages
        </Link>
        <Link
          to="/admin/orders"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 transition duration-150 font-medium"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
