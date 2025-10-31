// frontend-app/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../services/product.service";
import { useCart } from "../context/cart.context.js";

const ProductDetailPage = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity selector
  const { addToCart } = useCart();
  const [addedMessage, setAddedMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProduct(id);
        if (!data) {
          throw new Error("Product not found");
        }
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load product details");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  //  'Add to Cart' logic
  const handleAddToCart = () => {
    // We ensure price/stock are in the correct format just in case
    const item = {
      ...product,
      price: parseFloat(product.price),
      inStock: parseInt(product.inStock),
    };

    addToCart(item, quantity);
    setAddedMessage(
      `Successfully added ${quantity} x ${product.name} to cart!`
    );

    // Clear message after 3 seconds
    setTimeout(() => setAddedMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-2xl text-red-600">
        {error || "Product not found."}
      </div>
    );
  }

  const formattedPrice = parseFloat(product.price).toFixed(2);
  const stockAvailable = product.inStock > 0;

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left Side: Image */}
        <div className="md:w-1/2 p-6 bg-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Details and Actions */}
        <div className="md:w-1/2 p-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {product.name}
          </h1>
          <p className="text-lg text-yellow-600 mt-2 font-semibold">
            {product.category}
          </p>

          <div className="text-4xl font-bold text-gray-800 mt-4 border-b pb-4">
            ${formattedPrice}
          </div>

          <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mt-6 text-lg font-medium">
            {stockAvailable ? (
              <span className="text-green-600">
                In Stock: {product.inStock} units
              </span>
            ) : (
              <span className="text-red-600 font-bold">Sold Out</span>
            )}
          </div>

          {/* Add to Cart Section */}
          {stockAvailable && (
            <div className="mt-8 flex flex-col  space-y-3">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.inStock, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  min="1"
                  max={product.inStock}
                  className="w-20 border border-gray-300 p-2 rounded-lg text-center focus:ring-yellow-500 focus:border-yellow-500"
                />
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-md"
                >
                  Add to Cart
                </button>
              </div>
              {addedMessage && (
                <div className="text-sm text-green-600 font-medium">
                  {addedMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
