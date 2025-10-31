// frontend-app/src/components/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component acts as a gatekeeper for Admin-only pages
const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    // 1. If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. If authenticated but not admin, redirect to home
    if (!isAdmin) {
        // You might want to show a 403 Forbidden page here instead of home
        return <Navigate to="/" replace />; 
    }

    // 3. If authenticated AND admin, render the child component
    return children;
};

export default AdminRoute;