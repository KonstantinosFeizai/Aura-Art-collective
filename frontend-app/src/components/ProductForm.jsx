// frontend-app/src/components/ProductForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/product.service";

const ProductForm = ({ mode }) => {
  // mode is either 'add' or 'edit'
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL if in 'edit' mode

  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "",
    inStock: 0,
    isFeatured: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditMode = mode === "edit";

  // --- Fetch Product Data for Editing ---
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await ProductService.getProduct(id);
          if (!data) {
            throw new Error("Product not found");
          }
          setProduct({
            ...data,
            price: parseFloat(data.price),
            inStock: parseInt(data.inStock),
          });
        } catch (err) {
          setError(err.message || "Failed to load product data");
          setProduct({
            name: "",
            description: "",
            price: 0,
            category: "",
            imageUrl: "",
            inStock: 0,
            isFeatured: false,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isEditMode, id]);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditMode) {
        await ProductService.updateProduct(id, product);
        setMessage("Product updated successfully!");
      } else {
        await ProductService.createProduct(product);
        setMessage("Product created successfully!");
      }

      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(
        err.message || `Failed to ${isEditMode ? "update" : "create"} product`
      );
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && loading) {
    return <div className="text-center py-10">Loading Product to Edit...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        {isEditMode ? `Edit Product: ${product.name}` : "Add New Product"}
      </h1>

      {error && (
        <div className="p-3 rounded mb-4 bg-red-100 text-red-700">{error}</div>
      )}

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Category */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              In Stock
            </label>
            <input
              type="number"
              name="inStock"
              value={product.inStock}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Image URL (The key to fixing your image issue!) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Image URL (Public Link)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          ></textarea>
        </div>

        {/* Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={product.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          />
          <label className="ml-2 text-gray-700 font-medium">
            Mark as Featured
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50 transition duration-150"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
