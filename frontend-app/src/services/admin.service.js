// frontend-app/src/services/admin.service.js
/**
 * @fileoverview AdminService
 * @description Centralized service layer for handling admin-specific API calls,
 * such as fetching KPIs, managing contact messages, and other privileged operations.
 * All methods require an authenticated user with Admin roles.
 */
import axios from "axios";
// Import AuthService to retrieve the JWT internally without requiring it as a parameter.
const API_URL = "http://localhost:3001/api/admin/";

// Helper function to create auth headers
/**
 * @private
 * Retrieves the authentication header using the JWT from the current user.
 * This is necessary for all privileged admin endpoints.
 * @returns {Object} An object containing the Authorization header, or an empty object.
 */
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * Fetches key performance indicators (KPIs) and general site metrics.
 * Requires Admin privileges.
 * @returns {Promise<Object>} An object containing various metrics data.
 * @throws {Error} Throws an error if authorization fails or if the request fails.
 */
const getKpiMetrics = async (token) => {
  const response = await axios.get(API_URL + "kpis", authHeader(token));
  return response.data;
};

// Fetch paginated contact messages (Admin Only)
/**
 * Fetches paginated contact messages submitted by users.
 * Requires Admin privileges.
 * @param {number} [page=1] - The page number to fetch.
 * @param {number} [limit=10] - The number of messages per page.
 * @returns {Promise<Object>} An object containing messages, total pages, and current page info.
 * @throws {Error} Throws an error if authorization fails or if the request fails.
 */
const getContactMessages = async (token, page = 1, limit = 10) => {
  const response = await axios.get(
    `${API_URL}contact/messages?page=${page}&limit=${limit}`,
    authHeader(token)
  );
  return response.data;
};

// Delete a specific contact message by ID (Admin Only)
/**
 * Deletes a specific contact message by its ID.
 * Requires Admin privileges.
 * @param {string | number} messageId - The unique ID of the message to delete.
 * @returns {Promise<Object>} The server response, typically a confirmation message.
 * @throws {Error} Throws an error if authorization fails, the message is not found, or the request fails.
 */
const deleteContactMessage = async (token, messageId) => {
  // <-- NEW FUNCTION
  const response = await axios.delete(
    `${API_URL}contact/messages/${messageId}`,
    authHeader(token)
  );
  return response.data;
};

const AdminService = {
  getKpiMetrics,
  getContactMessages,
  deleteContactMessage,
};

export default AdminService;
