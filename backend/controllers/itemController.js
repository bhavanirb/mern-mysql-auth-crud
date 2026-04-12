// controllers/itemController.js
// Handles all CRUD operations for items
// ALL routes here are protected — req.user.id is always available

const db = require('../config/db');

// ─────────────────────────────────────────────
// @route   GET /api/items
// @desc    Get all items for logged in user
// @access  Protected
// ─────────────────────────────────────────────
const getItems = async (req, res) => {
  try {
    // Only fetch items belonging to the logged in user
    // req.user.id comes from the JWT token via auth middleware
    const [items] = await db.query(
      'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching items'
    });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Protected
// ─────────────────────────────────────────────
const getItem = async (req, res) => {
  try {
    // req.params.id comes from the URL: /api/items/5
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    // If no item found (either doesn't exist or belongs to another user)
    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item: items[0]
    });

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching item'
    });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/items
// @desc    Create a new item
// @access  Protected
// ─────────────────────────────────────────────
const createItem = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validate — title is required (from PDF schema: NOT NULL)
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Insert item — user_id links this item to the logged in user
    const [result] = await db.query(
      'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [
        req.user.id,
        title,
        description || null,
        status || 'active'      // default from PDF schema
      ]
    );

    // Fetch the newly created item to return it
    const [newItem] = await db.query(
      'SELECT * FROM items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item: newItem[0]
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating item'
    });
  }
};

// ─────────────────────────────────────────────
// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Protected
// ─────────────────────────────────────────────
const updateItem = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // First check: does this item exist AND belong to this user?
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Update — keep existing values if new ones not provided
    const updatedTitle       = title       || items[0].title;
    const updatedDescription = description || items[0].description;
    const updatedStatus      = status      || items[0].status;

    await db.query(
      'UPDATE items SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [updatedTitle, updatedDescription, updatedStatus, req.params.id, req.user.id]
    );

    // Fetch updated item and return it
    const [updatedItem] = await db.query(
      'SELECT * FROM items WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem[0]
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating item'
    });
  }
};

// ─────────────────────────────────────────────
// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Protected
// ─────────────────────────────────────────────
const deleteItem = async (req, res) => {
  try {
    // Check item exists and belongs to this user
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Delete it
    await db.query(
      'DELETE FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting item'
    });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/stats
// @desc    Get dashboard statistics for logged in user
// @access  Protected
// From PDF: total, active, pending, completed counts
// ─────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    // Single query to get all counts at once
    const [stats] = await db.query(
      `SELECT
        COUNT(*)                                          AS total,
        SUM(status = 'active')                            AS active,
        SUM(status = 'pending')                           AS pending,
        SUM(status = 'completed')                         AS completed
       FROM items
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      stats: {
        total:     stats[0].total     || 0,
        active:    stats[0].active    || 0,
        pending:   stats[0].pending   || 0,
        completed: stats[0].completed || 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats'
    });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getStats
};