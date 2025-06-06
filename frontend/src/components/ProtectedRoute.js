// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Not logged in → redirect to login
        return <Navigate to="/login" />;
    }

    // Logged in → render child component
    return children;
};

export default ProtectedRoute;