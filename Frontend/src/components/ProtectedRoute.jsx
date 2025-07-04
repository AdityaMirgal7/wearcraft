import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminToken');

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute; 