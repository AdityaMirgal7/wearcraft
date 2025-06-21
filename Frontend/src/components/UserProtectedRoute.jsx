import React from 'react';
import { Navigate } from 'react-router-dom';

function UserProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = user?.isLoggedIn;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default UserProtectedRoute; 