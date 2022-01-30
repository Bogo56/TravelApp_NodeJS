const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const AppError = require("./errors/customErrors.js");
const globalErrorHandler = require("./errorHandlers/globalErrHandler.js");
const rateLimit = require("express-rate-limit");
const sanitizeInput = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const engine = require("ejs-mate");
var cookieParser = require("cookie-parser");

const viewRouter = require("./routes/viewRoutes.js");
const toursRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");

const app = express();

// Set the template engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));

// 1.GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self' res.cloudinary.com mapbox.com data:"],
        "script-src": [
          "'self' *.mapbox.com https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js blob:",
        ],
        "default-src": ["'self' *.mapbox.com"],
      },
    },
  })
);

// Limit API requests per hour from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message:
    "Hourly request rate limit exceeded! Come back in an hour!",
});
app.use("/api", limiter);

// Reading data from request body and cookies
app.use(bodyParser.json({ limit: "10kb" }));
app.use(cookieParser());

// Protecting against noSQL db injections
app.use(sanitizeInput());

// Protection against XSS
app.use(xss());

// Record time of request - test middleware
app.use((req, res, next) => {
  const curTime = new Date().toISOString();
  req.time = curTime;
  next();
});

// 2.ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  const err = new AppError("Could not find the resource specified");
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
