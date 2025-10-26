// Wrapper function to handle asynchronous errors in Express middleware.
const catchAsync = (fn) => {
  // Returns a new middleware function.
  return (req, res, next) => {
    // Calls the asynchronous function with request, response, and next arguments.
    // If the function resolves successfully, continues to the next middleware.
    // If it rejects (throws an error), passes the error to the Express error handling middleware.
    fn(req, res, next).catch(next);
  };
};

// Exports the catchAsync function.
module.exports = catchAsync;
