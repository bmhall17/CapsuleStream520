import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  // If the token is not present, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children; //If token is present, render the children (protected component)
};

export default ProtectedRoute; // Export the ProtectedRoute component


