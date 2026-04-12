// src/api/itemApi.js
// All item CRUD related API calls

import API from './axios';

// Get all items for logged in user
export const getItems = async () => {
  const response = await API.get('/items');
  return response.data;
};

// Get single item
export const getItem = async (id) => {
  const response = await API.get(`/items/${id}`);
  return response.data;
};

// Create new item
export const createItem = async (itemData) => {
  const response = await API.post('/items', itemData);
  return response.data;
};

// Update item
export const updateItem = async (id, itemData) => {
  const response = await API.put(`/items/${id}`, itemData);
  return response.data;
};

// Delete item
export const deleteItem = async (id) => {
  const response = await API.delete(`/items/${id}`);
  return response.data;
};

// Get dashboard stats
export const getStats = async () => {
  const response = await API.get('/items/stats');
  return response.data;
};