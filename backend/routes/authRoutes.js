// routes/authRoutes.js
// Connects URL endpoints to controller functions

const express    = require('express');
const router     = express.Router();
const protect    = require('../middleware/auth');

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController');

// Public routes — no token needed
router.post('/register',        register);
router.post('/login',           login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

// Protected route — token required (protect middleware runs first)
router.get('/me', protect, getMe);

module.exports = router;