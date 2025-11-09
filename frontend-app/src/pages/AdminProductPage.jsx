import React, { useState, useEffect, useMemo } from "react";
import AdminService from "../services/admin.service";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductService from "../services/product.service";

const AdminProductPage = () => {
  // Auth + basic hooks (must run every render)
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  // Early redirect after hooks
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Fetch products (client-side pagination)
  const fetchProducts = async () => {
    setMessage("");
    setError(null);
    setLoading(true);
    try {
      const data = await ProductService.getAllProducts(
        currentUser?.accessToken
      );
      setProducts(data || []);
    } catch (err) {
      setError(`Failed to fetch products: ${err?.message || err}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  // Adjust current page when totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return products.slice(start, start + perPage);
  }, [products, currentPage, perPage]);

  const goToPage = (p) => {
    const page = Math.max(1, Math.min(totalPages, p));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

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
        err?.response?.data?.message ||
          "Failed to delete product. Check server logs."
      );
    }
  };

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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
          Admin Product Management
        </h1>

        {/* Add button: full width on mobile, right aligned on md+ */}
        <div className="w-full md:w-auto flex md:inline-flex justify-start md:justify-end">
          <Link
            to="/admin/add"
            className="w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 font-medium shadow-md text-center"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded mb-4 shadow-sm ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          {totalItems === 0
            ? "0"
            : `${(currentPage - 1) * perPage + 1}–${
                (currentPage - 1) * perPage + currentProducts.length
              }`}{" "}
          of {totalItems}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Per page</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>
      </div>

      {/* Mobile / Tablet card layout */}
      <div className="space-y-4 sm:hidden">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className="text-sm font-semibold text-gray-900 truncate"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {product.category}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-yellow-600 whitespace-nowrap">
                    ${(parseFloat(product.price) || 0).toFixed(2)}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to={`/admin/edit/${product.id}`}
                    className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
                  >
                    Delete
                  </button>
                  <div className="ml-auto text-xs text-gray-500">
                    Stock: {product.inStock}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet table */}
      <div className="hidden sm:block overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                ID
              </th>

              {/* New Image column visible on tablet+ */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell min-w-[80px]">
                Image
              </th>

              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[220px]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Stock
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.id}
                </td>

                {/* Image cell for tablet+ (hidden on xs) */}
                <td className="px-4 py-4 hidden sm:table-cell">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded-md border border-gray-100">
                      No Image
                    </div>
                  )}
                </td>

                <td className="px-4 py-4 text-sm text-gray-700 font-semibold max-w-[300px] min-w-0">
                  <div className="truncate" title={product.name}>
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.category}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${(parseFloat(product.price) || 0).toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.inStock}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/edit/${product.id}`}
                    className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50 px-4 py-3 rounded-lg gap-3">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            « First
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            ‹ Prev
          </button>

          {/* Numeric pages (up to 5) */}
          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const half = Math.floor(Math.min(totalPages, 5) / 2);
              let start = Math.max(
                1,
                Math.min(totalPages - 4, currentPage - half)
              );
              const pageNum = start + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pageNum === currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPage;
