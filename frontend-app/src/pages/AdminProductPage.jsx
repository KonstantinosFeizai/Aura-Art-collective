// frontend-app/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../services/product.service";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // Ensure security on the client side as well

  // Function to fetch all products for the admin table
  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch products: ${err.message}`);
      setProducts([]); // Clear any old data
    } finally {
      setLoading(false);
    }

    if (error) {
      return <div className="text-red-600 text-center py-4">{error}</div>;
    }

    if (!isAdmin) return null;
    if (loading) return <div>Loading...</div>;
  };

  useEffect(() => {
    // Redirection check: If user is not admin, redirect them
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [isAdmin, navigate]);

  // Function to handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductService.deleteProduct(productId);
        setMessage("Product deleted successfully!");
        // Refresh the list after deletion
        fetchProducts();
      } catch (error) {
        setMessage(error.message || "Failed to delete product. Check console.");
      }
    }
  };

  if (!isAdmin) return null; // Render nothing if not admin (will be redirected)

  if (loading)
    return <div className="text-center py-10">Loading Admin Data...</div>;

  return (
    <div className="py-10">
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150"
        >
          + Add New Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${parseFloat(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.inStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/edit/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
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

export default AdminDashboard;
