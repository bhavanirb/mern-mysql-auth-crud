// middleware/errorHandler.js
// This middleware catches ALL errors thrown anywhere in the app
// It runs when you call next(error) from any route handler

const errorHandler = (err, req, res, next) => {

  // Log the full error stack in terminal (for debugging)
  console.error(err.stack);

  // Default status code is 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;