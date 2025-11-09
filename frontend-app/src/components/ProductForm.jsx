// frontend-app/src/components/ProductForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/product.service";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "", // Existing URL input
    inStock: 0,
    isFeatured: false,
  });
  // 💡 NEW STATE: To hold the selected file object
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Fetch Product Data for Editing (No change needed here) ---
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
            name: data.name ?? "",
            description: data.description ?? "",
            price: parseFloat(data.price || 0),
            category: data.category ?? "",
            imageUrl: data.imageUrl ?? "",
            inStock: parseInt(data.inStock || 0),
            isFeatured: data.isFeatured ?? false,
          });
        } catch (err) {
          const errorMsg =
            err.response?.data?.message || "Failed to load product data";
          setError(errorMsg);
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
  }, [id, isEditMode]);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // 💡 NEW LOGIC: Handle file input separately
    if (type === "file") {
      setImageFile(files[0]);
      // Clear the existing imageUrl if a new file is selected, to avoid conflict
      setProduct((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Handle Form Submission (Crucially modified for FormData) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Create a FormData object to handle both text and file data
    const formData = new FormData();

    // 2. Append all product text fields
    for (const key in product) {
      if (key !== "imageUrl" && key !== "imageFile") {
        // Ensure numeric types are sent correctly
        let value = product[key];
        if (key === "price") value = parseFloat(value);
        if (key === "inStock") value = parseInt(value);

        formData.append(key, value);
      }
    }
    // Also append the existing imageUrl if no new file is uploaded (for edit mode)
    if (product.imageUrl && !imageFile) {
      formData.append("imageUrl", product.imageUrl);
    }

    // 3. Append the file if one was selected
    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
      // The key 'image' must match what your backend (e.g., Multer) expects!
    }

    try {
      if (isEditMode) {
        // UPDATE: Send FormData object
        await ProductService.updateProduct(id, formData, true); // Pass true flag for file upload
        setMessage("Product updated successfully!");
      } else {
        // CREATE: Send FormData object
        await ProductService.createProduct(formData, true); // Pass true flag for file upload
        setMessage("Product created successfully!");
      }

      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(
        errorMessage || `Failed to ${isEditMode ? "update" : "create"} product`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Conditional Rendering (omitted for brevity, remains the same) ---
  if (isEditMode && loading) {
    return (
      <div className="text-center py-10 text-xl font-semibold text-gray-600">
        Loading Product to Edit...
      </div>
    );
  }

  if (isEditMode && error) {
    return (
      <div className="text-center py-10 text-xl font-semibold text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        {isEditMode
          ? `Edit Product: ${product.name || "(Loading Name...)"}`
          : "Add New Product"}
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
        {/* ... (Name, Category, Price, Stock fields remain the same) ... */}
        <div className="grid grid-cols-2 gap-6">
          {/* Name Input */}
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
          {/* Category Input */}
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
          {/* Price Input */}
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
          {/* Stock Input */}
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

        {/* 💡 FILE UPLOAD SECTION */}
        <div className="border border-dashed border-gray-400 p-4 rounded-lg bg-gray-50 space-y-3">
          <p className="text-gray-700 font-semibold text-sm">
            Product Image Source (Choose one):
          </p>

          {/* Option A: File Upload Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Image from PC
            </label>
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
            {imageFile && (
              <p className="text-xs text-green-600 mt-1">
                File selected: **{imageFile.name}**
              </p>
            )}
          </div>

          <div className="text-center text-gray-500 text-sm">OR</div>

          {/* Option B: Image URL Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Image URL (Public Link)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              disabled={!!imageFile} // Disable if a file is selected
              placeholder="Enter a public image link..."
              className={`w-full border p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 ${
                !!imageFile
                  ? "bg-gray-200 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
            {product.imageUrl && (
              <p className="text-xs text-blue-600 mt-1">Current URL set.</p>
            )}
          </div>
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

        {/* Checkbox and Submit Button (remain the same) */}
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

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
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
