const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const AppError = require("./errors/customErrors.js");
const globalErrorHandler = require("./errorHandlers/globalErrHandler.js");

const toursRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());

app.use((req, res, next) => {
  const curTime = new Date().toISOString();
  req.time = curTime;
  next();
});

// ROUTES
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  const err = new AppError("Could not find the resource specified");
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
