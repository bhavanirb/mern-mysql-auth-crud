// routes/itemRoutes.js
// ALL these routes are protected — every request needs a valid JWT token

const express    = require('express');
const router     = express.Router();
const protect    = require('../middleware/auth');

const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getStats
} = require('../controllers/itemController');

// protect middleware runs before EVERY route below
router.get  ('/',       protect, getItems);
router.get  ('/stats',  protect, getStats);
router.get  ('/:id',    protect, getItem);
router.post ('/',       protect, createItem);
router.put  ('/:id',    protect, updateItem);
router.delete('/:id',  protect, deleteItem);

module.exports = router;