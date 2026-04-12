// middleware/auth.js
// This runs BEFORE protected routes
// It checks: does this request have a valid JWT token?

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

  let token;

  // JWT is sent in the Authorization header like:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Split "Bearer tokenstring" → grab the token part
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found, reject the request immediately
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }

  try {
    // Verify the token using our secret key from .env
    // If valid → decoded contains the user data we put in it
    // If invalid/expired → throws an error → goes to catch block
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req so route handlers can use it
    // e.g. req.user.id → the logged in user's ID
    req.user = decoded;

    // Call next() to move to the actual route handler
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

module.exports = protect;