// Import the application configuration.
const config = require('../config');

// Import the AppError class to handle errors.
const AppError = require('../utils/appError');

// ---------- Functions to handle specific errors ---------- //
/**
 * All functions to handle a specific error must have the message and the code.
 */

// Function to handle unauthorized errors
const handleUnauthorizedError = (message, code) => {
  return new AppError(message, code);
};

// Function to handle JWT expiration errors
const handleJWTExpiredError = (message, code) => {
  return new AppError(message, code);
};

// Function to handle JSON Web Token errors
const handleJsonWebTokenError = (message, code) => {
  return new AppError(message, code);
};

// ---------- Function to handle errors in production environments ---------- //
const sendErrorProd = async (err, req, res) => {
  // Check if the error is operational.
  if (err.isOperational) {
    // Return a JSON response with the status code and message of the error.
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Return a JSON response indicating that there was an error on the server.
    return res.status(500).json({
      status: 'fail',
      message: config.errorMessages.serverError,
    });
  }
};

// ---------- Function to handle errors in development environments ---------- //
const sendErrorDev = (err, req, res) => {
  // Get the request's path and HTTP method.
  const { path, method } = req;

  // Log the error to the console and return a JSON response with error details.
  console.log({ err, path, method });
  return res.status(err.statusCode).json({
    path,
    method,
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

// ---------- Function to handle errors in test environments ---------- //
const sendErrorTest = (err, res) => {
  // Return a JSON response with error details and the provided status code.
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Return a JSON response indicating that there was an error on the server.
    return res.status(500).json({
      status: 'fail',
      message: config.errorMessages.serverError,
    });
  }
};

// ---------- Function to handle errors globally ---------- //
const globalErrorHandler = (err, req, res, next) => {
  // Set the default status code if not defined.
  err.statusCode = err.statusCode || 500;

  // Set the default status if not defined.
  err.status = err.status || 'fail';

  // Check if the environment is test.
  if (config.nodeenv === 'test') {
    // Call the function to handle errors in test.
    sendErrorTest(err, res);
  }

  // Check if the environment is development.
  if (config.nodeenv === 'development') {
    // Call the function to handle errors in development.
    sendErrorDev(err, req, res);
  }

  // Check if the environment is production.
  if (config.nodeenv === 'production') {
    // Determine the error type and call the corresponding function to handle it.
    let error = err;
    if (err.inner?.message === 'No authorization token was found')
      error = handleUnauthorizedError(
        'Se necesita la credencial para ingresar.',
        401
      );
    if (err.inner?.name === 'TokenExpiredError')
      error = handleJWTExpiredError('El token ha expirado.', 401);
    if (err.inner?.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError('El token es inválido.', 401);

    // Call the function to handle errors in production.
    sendErrorProd(error, req, res);
  }
};

// Export the globalErrorHandler function for use in other parts of the application.
module.exports = globalErrorHandler;
