// frontend-app/src/services/auth.service.js
/**
 * @fileoverview AuthService
 * @description Service layer dedicated to user authentication and authorization (login, register, logout).
 * It manages the storage and retrieval of the user's JWT (JSON Web Token) and user data in local storage.
 */
import axios from "axios";

// The URL for your backend API authentication endpoints
const API_URL = "http://localhost:3001/api/auth/";

class AuthService {
  // --- LOGIN FUNCTION ---
  /**
   * Attempts to log in a user with the provided credentials.
   * If successful, saves the user object (including accessToken) to local storage.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} The server response data (typically { id, username, email, accessToken, roles }).
   * @throws {string} An error message if login fails (e.g., invalid credentials or network error).
   */
  async login(email, password) {
    try {
      const response = await axios.post(API_URL + "login", {
        email,
        password,
      });

      // If login is successful and a token is returned, save it to local storage
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      // Re-throw error to be handled by the component (e.g., displaying error message)
      throw error.response.data.message || "Login failed due to network error.";
    }
  }

  // --- LOGOUT FUNCTION ---
  logout() {
    // Remove the user data (including the token) from local storage
    localStorage.removeItem("user");
  }

  // --- REGISTER FUNCTION ---
  /**
   * Registers a new user account.
   * Note: This method does NOT automatically log in the user upon successful registration.
   * @param {string} username - The desired username.
   * @param {string} email - The user's email address.
   * @param {string} password - The desired password.
   * @returns {Promise<Object>} The server response data, usually containing a success message or the new user's basic info.
   * @throws {string} An error message if registration fails (e.g., email already in use, validation issues).
   */
  async register(username, email, password) {
    try {
      const response = await axios.post(API_URL + "register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Handle backend validation errors (like email already exists)
      throw error.response.data.message || "Registration failed.";
    }
  }

  // --- GET CURRENT USER FUNCTION ---
  /**
   * Retrieves the currently logged-in user's data (including the token) from local storage.
   * This is used to maintain the user's session state across page reloads.
   * @returns {Object | null} The user object if authenticated, or null if no user data is found.
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    // Parse the JSON string back into an object before returning
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
