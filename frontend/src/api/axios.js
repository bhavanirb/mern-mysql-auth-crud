// src/api/axios.js
// Central Axios instance used by ALL API calls
// Automatically attaches JWT token to every request

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // our Express backend
});

// REQUEST interceptor
// Runs before every request is sent
// Automatically adds Authorization header if token exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor
// Runs after every response comes back
// If 401 (unauthorized) → token expired → auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;