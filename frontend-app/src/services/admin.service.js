// frontend-app/src/services/admin.service.js:{Update Admin Service with Delete}:frontend-app/src/services/admin.service.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/admin/";

// Helper function to create auth headers
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getKpiMetrics = async (token) => {
  const response = await axios.get(API_URL + "kpis", authHeader(token));
  return response.data;
};

// Fetch paginated contact messages (Admin Only)
const getContactMessages = async (token, page = 1, limit = 10) => {
  const response = await axios.get(
    `${API_URL}contact/messages?page=${page}&limit=${limit}`,
    authHeader(token)
  );
  return response.data;
};

// Delete a specific contact message by ID (Admin Only)
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
  deleteContactMessage, // <-- EXPORT NEW FUNCTION
};

export default AdminService;
