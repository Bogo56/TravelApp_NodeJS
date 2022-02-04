const AppError = require("../errors/customErrors.js");

const handleValErr = (err) => {
  const messages = Object.values(err.errors)
    .map((el) => {
      return el.message;
    })
    .join("; ");
  return new AppError(messages, 400);
};

const handleJWTErr = (err) => {
  const message = `${err.message}! Please log in!`;
  return new AppError(message, 401);
};

const handleCastError = (err) => {
  const message = `Wrong value for path /${err.path}/ , must be of type /${err.kind}/ !`;
  return new AppError(message, 400);
};

const handleDuplicate = (err) => {
  const message = `A record for path: '${
    Object.keys(err.keyValue)[0]
  }' already exists. Please choose another name.`;
  return new AppError(message, 400);
};

const sendErrDEV = (err, res) => {
  res.status(400).json({
    status: "Failed",
    err: err,
    msg: err.message,
    stack: err.stack,
  });
};

const sendErrPROD = (err, res) => {
  const statusCode = err.status || 500;
  let message = err.message;

  //   If Error is not operational(database stuff) and is related to errors with the code
  // itself, we don't want to leak data to the client and show a generic message!
  if (!err.isOperational)
    message = "There was a problem with the request";

  res.status(statusCode).json({
    status: "Failed",
    msg: message,
  });
};

const globalHandler = (err, req, res, next) => {
  let error = { ...err };
  if (process.env.NODE_ENV === "development") {
    // Check if the error must be rendered on the UI( Not as API response)
    err.onView ? next(err) : sendErrDEV(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") error = handleValErr(error);

    if (err.name === "CastError") error = handleCastError(err);

    if (err.code === 11000) error = handleDuplicate(err);

    if (err.name === "JsonWebTokenError") error = handleJWTErr(err);

    // Check if the error must be rendered on the UI( Not as API response)
    err.onView ? next(error) : sendErrPROD(error, res);
  }
};

module.exports = globalHandler;
