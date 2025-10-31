import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// We can add actual data fetching here later (Total Orders, Revenue, etc.)
const dummyStats = [
  { label: "Total Products", value: "25", icon: "📦", link: "/admin/products" },
  { label: "Pending Orders", value: "3", icon: "⏳", link: "/admin/orders" },
  {
    label: "Total Revenue",
    value: "$12,450",
    icon: "💰",
    link: "/admin/orders",
  },
  { label: "New Users (30 Days)", value: "18", icon: "👤", link: "/admin" },
];

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Enforce Admin and Authentication
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        👋 Welcome to the Admin Dashboard
      </h1>

      <p className="text-gray-600 mb-10">
        Quick links and key metrics to manage your store.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dummyStats.map((stat) => (
          <Link to={stat.link} key={stat.label} className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Management Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="p-4 bg-yellow-500 text-white rounded-lg text-lg font-medium hover:bg-yellow-600 transition text-center"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="p-4 bg-yellow-500 text-white rounded-lg text-lg font-medium hover:bg-yellow-600 transition text-center"
          >
            Manage Customer Orders
          </Link>
          {/* Add more management links here later (e.g., Users, Settings) */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
