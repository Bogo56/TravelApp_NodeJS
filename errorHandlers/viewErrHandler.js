// Middleware that renders errors on the UI
const viewErrHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  let errMessage = err.message;

  if (!err.isOperational && process.env.NODE_ENV === "production")
    errMessage = "There was a problem with the request";

  res.status(statusCode).render("error", { errMessage });
};

module.exports = viewErrHandler;
