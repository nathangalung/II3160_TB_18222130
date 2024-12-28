import React from 'react';
import { Navigate } from 'react-router-dom';

interface UnprotectedRouteProps {
    children: React.ReactNode;
    isAuthenticated: boolean; // Prop to check if the user is authenticated
}

const UnprotectedRoute: React.FC<UnprotectedRouteProps> = ({ children, isAuthenticated }) => {
    // If the user is authenticated, redirect to the dashboard or home page
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children};</>; // Render the children if not authenticated
};

export default UnprotectedRoute;
