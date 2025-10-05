const logger = require('../utils/logger');

exports.handleNotFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

exports.handleErrors = (error, req, res, next) => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Set default status code
  let statusCode = error.status || 500;
  let message = error.message;

  // MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 400;
    message = 'Username already exists';
  }

  // MongoDB validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(val => val.message).join(', ');
  }

  // Cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // Render error page for HTML requests, JSON for API requests
  if (req.accepts('html')) {
    res.status(statusCode).render('errors/error', {
      statusCode,
      message: statusCode === 404 ? 'Page not found' : 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message: statusCode === 404 ? 'Resource not found' : message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};