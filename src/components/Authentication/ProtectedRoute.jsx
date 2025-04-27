import { Navigate } from 'react-router-dom';
import React from 'react';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    console.log('ProtectedRoute props:', { isAuthenticated, children });
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
