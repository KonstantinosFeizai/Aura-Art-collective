// frontend-app/src/pages/ShopPage.jsx

import React, { useState, useEffect } from "react";
import ProductService from "../services/product.service";
import { Link } from "react-router-dom";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch products
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load products: ${err.message}`);
        setProducts([]); // Clear any old data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs only once on mount

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

  // --- Product Display Grid ---
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Art Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          >
            {/* Image Placeholder/Display */}
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

            {/* Product Info */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-2xl font-bold text-yellow-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>

                {/* Link to detail page (to be built next) */}
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
    </div>
  );
};

export default ShopPage;
