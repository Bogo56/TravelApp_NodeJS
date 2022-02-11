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
  if (process.env.NODE_ENV === "development") {
    // Check if the error must be rendered on the UI( Not as API response)
    err.onView ? next(err) : sendErrDEV(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    // Make a copy of the original error before modifying it (looses the onView property)
    const errCopy = { ...err };

    if (err.name === "ValidationError") err = handleValErr(err);

    if (err.name === "CastError") err = handleCastError(err);

    if (err.code === 11000) err = handleDuplicate(err);

    if (["JsonWebTokenError", "TokenExpiredError"].includes(err.name))
      err = handleJWTErr(err);

    // Check if the error must be rendered on the UI( Not as API response)
    errCopy.onView ? next(err) : sendErrPROD(err, res);
  }
};

module.exports = globalHandler;
