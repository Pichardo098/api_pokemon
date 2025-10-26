// Define a custom error class called AppError that extends the built-in Error class in JavaScript.
class AppError extends Error {
  // Constructor function for initializing a new AppError object.
  constructor(message, statusCode) {
    // Call the constructor of the parent class (Error) with the provided error message.
    super(message);

    // Initialize the statusCode property with the provided status code.
    this.statusCode = statusCode;

    // Determine the status of the error based on the statusCode.
    // If the statusCode starts with '4' (client error), set status to 'error';
    // otherwise, set it to 'fail'.
    this.status = String(statusCode).startsWith('4') ? 'error' : 'fail';

    // Mark this error as operational, meaning it's intended to be caught and handled within the application.
    this.isOperational = true;

    // Capture the stack trace to provide information about where the error occurred.
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the AppError class so it can be used in other parts of the application.
module.exports = AppError;
