// src/context/AuthContext.jsx
// Global authentication state — available everywhere in the app
// Stores: user data, token, login/logout functions

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provider component — wraps the entire app
export const AuthProvider = ({ children }) => {

  // Initialize state from localStorage
  // So user stays logged in after page refresh
  const [user, setUser]       = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [token, setToken]     = useState(
    localStorage.getItem('token') || null
  );
  const [loading, setLoading] = useState(false);

  // Login function — saves to state AND localStorage
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user',  JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // Logout function — clears everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // isAuthenticated — true if token exists
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — makes using context cleaner
// Instead of: useContext(AuthContext)
// We use:     useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default AuthContext;