import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";
import { useAuth } from "../context/AuthContext";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Access currentUser for token and isAdmin check

  // Function to fetch all products for the admin table
  const fetchProducts = async () => {
    // Clear old state messages and reset loading state
    setMessage("");
    setError(null);
    setLoading(true);

    try {
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(`Failed to fetch products: ${err.message}`);
      setProducts([]); // Clear any old data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic security check and redirection
    if (!currentUser || !currentUser.roles.includes("admin")) {
      navigate("/");
      return;
    }

    // Fetch products once authenticated
    fetchProducts();
  }, [currentUser, navigate]);

  // Function to handle product deletion
  const handleDelete = async (productId) => {
    // Using a simple window.confirm as a temporary placeholder.
    // This MUST be replaced by a custom modal UI in production.
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    if (!currentUser || !currentUser.accessToken) {
      setMessage("Authentication failed. Cannot delete.");
      return;
    }

    try {
      // Use the token for the Admin action
      await ProductService.deleteProduct(productId, currentUser.accessToken);
      setMessage("Product deleted successfully!");
      // Refresh the list after deletion
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

  // Check user role first
  if (!currentUser || !currentUser.roles.includes("admin")) return null;

  if (loading)
    return <div className="text-center py-10">Loading Products...</div>;

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Admin Product Management
      </h1>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
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
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
