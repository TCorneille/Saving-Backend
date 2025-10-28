// utils/appError.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent constructor (Error) with message

    this.statusCode = statusCode;                     // HTTP status code
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 'fail' for client errors, 'error' for server errors
    this.isOperational = true;                        // Mark as operational (trusted) error

    // Capture stack trace, excluding this constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
