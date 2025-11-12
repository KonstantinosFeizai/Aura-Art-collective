/** frontend-app/src/services/product.service.js
 * @fileoverview ProductService
 * @description Centralized service layer for handling all product-related API calls.
 * This class abstracts the logic for fetching public product data and performing
 * authenticated/authorized (Admin) actions like creating, updating, and deleting products.
 */
import axios from "axios";

// Base URL for the product API endpoints
const API_URL = "http://localhost:3001/api/products/";

class ProductService {
  /**
   * @private
   * Helper function to retrieve the JWT (JSON Web Token) from local storage
   * and format it for the Authorization header.
   * This token is required for all authenticated (Admin/User) endpoints.
   * @returns {Object} An object containing the Authorization header, or an empty object if no token is found.
   */
  _getAuthHeader() {
    // Note: In a production environment, tokens should be stored securely (e.g., HTTP-only cookies).
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
      return { Authorization: "Bearer " + user.accessToken };
    } else {
      return {};
    }
  }

  // --- Public Methods (No Authentication Required) ---

  /**
   * Fetches a list of all products. Supports optional pagination parameters.
   * @param {number | null} [page=null] - The page number to fetch (1-based index).
   * @param {number | null} [limit=null] - The number of items per page.
   * @returns {Promise<Object>} The response data, usually containing a list of products
   * and pagination metadata (totalPages, currentPage, etc.).
   */
  async getAllProducts(page = null, limit = null) {
    try {
      let url = API_URL;
      const params = [];

      if (page !== null) {
        params.push(`page=${page}`);
      }
      if (limit !== null) {
        params.push(`limit=${limit}`);
      }

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  /**
   * Fetches a single product's details by its ID.
   * @param {string | number} id - The unique ID of the product.
   * @returns {Promise<Object>} The detailed product data object.
   */
  async getProduct(id) {
    try {
      const response = await axios.get(API_URL + id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // --- Admin Methods (Authentication & Authorization Required) ---

  /**
   * Creates a new product entry in the database. Requires Admin role.
   * @param {Object} productData - The data for the new product (e.g., name, price, description).
   * @returns {Promise<Object>} The newly created product object.
   */
  async createProduct(productData) {
    try {
      const response = await axios.post(API_URL, productData, {
        headers: this._getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      // Throw error to be caught by the calling component (e.g., ProductForm)
      throw error;
    }
  }

  /**
   * Deletes a product by its ID. Requires Admin role.
   * @param {string | number} id - The ID of the product to delete.
   * @returns {Promise<Object>} Confirmation message or status of the deletion.
   */
  async deleteProduct(id) {
    try {
      const response = await axios.delete(API_URL + id, {
        headers: this._getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      // Custom error message extraction for clarity
      throw new Error(
        error.response?.data?.message ||
          `Failed to delete product ${id}. Access denied or server error.`
      );
    }
  }

  /**
   * Updates an existing product by its ID. Requires Admin role.
   * @param {string | number} id - The ID of the product to update.
   * @param {Object} productData - The updated data for the product.
   * @returns {Promise<Object>} The updated product object.
   */
  async updateProduct(id, productData) {
    try {
      const response = await axios.put(API_URL + id, productData, {
        headers: this._getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      // Custom error message extraction
      throw new Error(
        error.response?.data?.message || `Failed to update product ${id}.`
      );
    }
  }
}

export default new ProductService();
