// frontend-app/src/services/order.service.js

import axios from "axios";
import AuthService from "./auth.service"; // Use AuthService to get the token

const API_URL = "http://localhost:3001/api/orders/";

class OrderService {
  // Helper to get the authenticated header
  _getAuthHeader() {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      return { "x-access-token": user.accessToken };
    } else {
      return {};
    }
  }

  // --- Submit a new order ---
  async submitOrder(orderData) {
    try {
      const response = await axios.post(
        API_URL,
        orderData,
        { headers: this._getAuthHeader() } // Must send the JWT
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error submitting order:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to submit order. Please log in and try again."
      );
    }
  }

  // --- Get user's order history ---
  async getOrderHistory() {
    try {
      const response = await axios.get(
        API_URL,
        { headers: this._getAuthHeader() } // Must send the JWT
      );
      return response.data;
    } catch (error) {
      // It's okay if the user has no orders (404), but we handle other errors
      if (error.response?.status === 404) {
        return []; // Return empty array if no orders are found
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

  // 3. Get ALL system orders (Admin only) <-- NEW METHOD
  async getAllOrders() {
    try {
      const response = await axios.get(API_URL + "all", {
        headers: this._getAuthHeader(),
      });
      return response.data;
    } catch (error) {
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

  // 4. Update order status (Admin only) <-- NEW METHOD
  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await axios.put(
        `${API_URL}${orderId}`,
        { status: newStatus },
        { headers: this._getAuthHeader() }
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
