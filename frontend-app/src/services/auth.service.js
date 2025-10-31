// frontend-app/src/services/auth.service.js

import axios from 'axios';

// The URL for your backend API authentication endpoints
const API_URL = "http://localhost:3001/api/auth/";

class AuthService {
  
  // --- LOGIN FUNCTION ---
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
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();