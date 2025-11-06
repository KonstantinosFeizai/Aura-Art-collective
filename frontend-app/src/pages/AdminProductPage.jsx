import React, { useState, useEffect } from "react";
import AdminService from "../services/admin.service";
import { Link, useNavigate, Navigate } from "react-router-dom"; // 💡 Added Navigate
import { useAuth } from "../context/AuthContext";
import ProductService from "../services/product.service";

const AdminProductPage = () => {
  // Use the clean flags from the context
  const { currentUser, isAuthenticated, isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Initial Access Check & Redirect (Safe and clean way to check)
  if (!isAuthenticated || !isAdmin) {
    // If auth state hasn't loaded (isAuthenticated is false initially),
    // we should wait, or if it has loaded and user is not admin, redirect.
    // The AuthContext should handle the loading state, so we trust these flags.
    return <Navigate to="/" replace />;
  }

  // Function to fetch all products for the admin table
  const fetchProducts = async () => {
    setMessage("");
    setError(null);
    setLoading(true);

    try {
      // We pass the token, which is safely available now due to the check above
      const data = await ProductService.getAllProducts(currentUser.accessToken);
      setProducts(data);
    } catch (err) {
      setError(`Failed to fetch products: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 2. Fetch data ONLY if we passed the initial security check
    // We don't need the redundant .roles.includes() check here anymore.
    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
    // Dependency array relies on isAuthenticated and isAdmin, which are clean flags
  }, [isAuthenticated, isAdmin]);

  // Function to handle product deletion
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    if (!currentUser || !currentUser.accessToken) {
      setMessage("Authentication failed. Cannot delete.");
      return;
    }

    try {
      await ProductService.deleteProduct(productId, currentUser.accessToken);
      setMessage("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Deletion error:", err);
      setMessage(
        err.response?.data?.message ||
          "Failed to delete product. Check server logs."
      );
    }
  };

  // --- Rendering Logic ---

  // Since the security check is handled by the immediate 'if' block at the top
  // and the redirect is fired, we can remove the second redundant check here:

  if (loading)
    return (
      <div className="text-center py-10 text-indigo-600 font-semibold text-xl">
        Loading Products...
      </div>
    );

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Admin Product Management
      </h1>

      {message && (
        <div
          // 💡 The crash used to happen here in your original file (Line 74).
          // The fix is ensuring 'message' is always a string (which it is via useState("")).
          // Relying on the clean auth logic above prevents it from rendering
          // before message is initialized.
          className={`p-3 rounded mb-4 shadow-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex justify-end mb-6">
        <Link
          to="/admin/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 font-medium shadow-md"
        >
          + Add New Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${parseFloat(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.inStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/edit/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-800 transition duration-150 mr-4 font-semibold"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 transition duration-150 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductPage;
