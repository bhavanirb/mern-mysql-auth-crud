// src/components/PublicRoute.jsx
// If user IS logged in → redirect to /dashboard (no need to see login again)
// If user is NOT logged in → show the page (login/register)

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;