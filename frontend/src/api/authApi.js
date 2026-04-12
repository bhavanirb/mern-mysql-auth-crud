// src/api/authApi.js
// All authentication related API calls

import API from './axios';

// Register new user
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// Forgot password — sends reset email
export const forgotPassword = async (email) => {
  const response = await API.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password with token
export const resetPassword = async (token, password) => {
  const response = await API.post('/auth/reset-password', { token, password });
  return response.data;
};

// Get current logged in user
export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};