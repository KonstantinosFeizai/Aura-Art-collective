// frontend-app/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/auth.service";

// 1. Create the Context object
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // State to hold the current user data (including token/role)
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  // Effect to check local storage on initial load
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Function to handle login (updates state and calls service)
  const login = async (email, password) => {
    const user = await AuthService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  // Function to handle logout (updates state and calls service)
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // Value bundle passed to consumers
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom Hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};
