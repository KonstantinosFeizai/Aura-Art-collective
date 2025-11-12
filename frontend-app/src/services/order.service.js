/**
 * @fileoverview OrderService
 * @description Centralized service layer for handling all order-related API calls.
 * This class manages authenticated requests for submitting new orders, retrieving
 * a user's order history, and performing administrative tasks like fetching all
 * orders and updating order statuses.
 */
import axios from "axios";
// Importing AuthService is necessary to retrieve the currently logged-in user's token.
import AuthService from "./auth.service";

// Base URL for the order API endpoints
const API_URL = "http://localhost:3001/api/orders/";

class OrderService {
  /**
   * @private
   * Retrieves the authentication header containing the JWT from the authenticated user.
   * This service assumes that AuthService is responsible for handling the user object/token storage.
   * Note: The header name used here is "x-access-token", which is common in older token setups,
   * but often "Authorization: Bearer <token>" is preferred. Ensure this matches your backend's expectation.
   * @returns {Object} An object containing the authentication header, or an empty object if no token is present.
   */
  _getAuthHeader() {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      return { "x-access-token": user.accessToken };
    } else {
      return {};
    }
  }

  // --- User/Customer Methods (Authentication Required) ---

  /**
   * Submits a new order to the backend after checkout.
   * Requires the user to be logged in (authenticated).
   * @param {Object} orderData - The complete order details, including shipping info and line items.
   * @returns {Promise<Object>} The server response, typically the newly created order object with an ID.
   */
  async submitOrder(orderData) {
    try {
      const response = await axios.post(
        API_URL,
        orderData,
        { headers: this._getAuthHeader() } // JWT required for authorization
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error submitting order:",
        error.response?.data?.message || error.message
      );
      // Throw a generalized error for the consuming component
      throw new Error(
        error.response?.data?.message ||
          "Failed to submit order. Please log in and try again."
      );
    }
  }

  /**
   * Retrieves the authenticated user's personal order history.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of order objects.
   * Returns an empty array if no orders are found (HTTP 404).
   */
  async getOrderHistory() {
    try {
      const response = await axios.get(
        API_URL,
        { headers: this._getAuthHeader() } // JWT required for user identification
      );
      return response.data;
    } catch (error) {
      // Gracefully handle 404 (Not Found) status by returning an empty list,
      // as it means the user simply has no orders yet.
      if (error.response?.status === 404) {
        return [];
      }
      console.error(
        "Error fetching order history:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to retrieve order history."
      );
    }
  }

  // --- Admin Methods (Authentication & Admin Authorization Required) ---

  /**
   * Retrieves a list of all orders placed in the system. Requires Admin privileges.
   * The endpoint used is typically '/api/orders/all'.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of all order objects.
   */
  async getAllOrders() {
    try {
      const response = await axios.get(API_URL + "all", {
        headers: this._getAuthHeader(), // Token required for Admin check
      });
      return response.data;
    } catch (error) {
      // Explicitly check for 403 Forbidden to provide a clear error message
      if (error.response?.status === 403) {
        throw new Error("Access Denied. Admin privileges required.");
      }
      console.error(
        "Error fetching all orders:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to retrieve all orders."
      );
    }
  }

  /**
   * Updates the status (e.g., 'Pending', 'Shipped', 'Delivered') of a specific order.
   * Requires Admin privileges.
   * @param {string | number} orderId - The ID of the order to update.
   * @param {string} newStatus - The new status to set for the order.
   * @returns {Promise<Object>} The updated order object from the server.
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await axios.put(
        // Construct the specific API endpoint URL, e.g., /api/orders/123
        `${API_URL}${orderId}`,
        { status: newStatus }, // Payload containing the status update
        { headers: this._getAuthHeader() } // Token required for Admin check
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating order #${orderId} status:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update order status."
      );
    }
  }
}

export default new OrderService();
