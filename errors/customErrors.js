class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.isOperational = true;
    this.onView = false;
  }
}

module.exports = AppError;
