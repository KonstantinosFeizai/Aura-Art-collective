// frontend-app/src/pages/ShopPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import ProductService from "../services/product.service";
import { Link } from "react-router-dom";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12); // items per page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data || []);
        setError(null);
      } catch (err) {
        setError(`Failed to load products: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Compute pagination values
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  // Clamp current page if perPage or products change
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

  if (loading) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-xl text-red-600">{error}</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl text-gray-700">No products found.</h2>
        <p className="mt-2 text-gray-500">The Admin needs to add some items!</p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
        Art Collection
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="text-sm text-gray-600">
          Showing{" "}
          {currentProducts.length > 0
            ? `${(currentPage - 1) * perPage + 1}–${
                (currentPage - 1) * perPage + currentProducts.length
              }`
            : "0"}{" "}
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
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm">Image Placeholder</span>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-2xl font-bold text-yellow-600">
                  ${parseFloat(product.price || 0).toFixed(2)}
                </span>

                <Link
                  to={`/product/${product.id}`}
                  className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 transition duration-150"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            « First
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ‹ Prev
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
