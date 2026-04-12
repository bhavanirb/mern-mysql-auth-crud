// controllers/authController.js
// Contains all authentication logic:
// register, login, forgot-password, reset-password, getMe

const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');
const crypto      = require('crypto');     // built-in Node.js module
const nodemailer  = require('nodemailer');
const db          = require('../config/db');

// ─────────────────────────────────────────────
// HELPER: generate JWT token for a user
// ─────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // payload: what we store in the token
    process.env.JWT_SECRET,          // secret key to sign it
    { expiresIn: process.env.JWT_EXPIRE } // expires in 7d
  );
};

// ─────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    // Step 1: Get data from request body
    const { name, email, phone, password } = req.body;

    // Step 2: Validate - all required fields present?
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Step 3: Check if email already exists in database
    // Using parameterized query (?) to prevent SQL injection
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Step 4: Hash the password before saving
    // bcrypt.hash(password, saltRounds)
    // saltRounds = 10 means it hashes 2^10 = 1024 times → very hard to crack
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Insert new user into database
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, hashedPassword]
    );

    // Step 6: Generate JWT token using the new user's ID
    const token = generateToken(result.insertId);

    // Step 7: Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id:    result.insertId,
        name,
        email,
        phone: phone || null
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    // Step 1: Get email and password from request body
    const { email, password } = req.body;

    // Step 2: Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Step 3: Find user by email in database
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    // If no user found with that email
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Step 4: Compare entered password with hashed password in DB
    // bcrypt.compare() returns true if they match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Step 5: Generate token
    const token = generateToken(user.id);

    // Step 6: Send response (never send password back!)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
// ─────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email'
      });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Generate a random reset token using Node's crypto module
    const resetToken  = crypto.randomBytes(32).toString('hex');

    // Token expires in 1 hour from now
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // Save token and expiry in database
    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, expiry, email]
    );

    // Send reset email
    const transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending reset email'
    });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
// ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user with this token AND token not expired yet
    const [users] = await db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear the reset token
    await db.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Protected (needs JWT token)
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user.id comes from the auth middleware
    // it was decoded from the JWT token
    const [users] = await db.query(
      'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe
};