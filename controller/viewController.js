const TourModel = require("../model/tourModel.js");
const ReviewModel = require("../model/reviewModel.js");
const bookingModel = require("../model/bookingModel.js");
const AppError = require("../errors/customErrors.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

exports.showOverview = catchAsyncError(
  async function (req, res, next) {
    //  1. Get All Tours
    const tours = await TourModel.find();
    const heading = "ALL TOURS";

    res.render("overview", { tours, heading });
  },
  { renderErrOnView: true }
);

exports.showTour = catchAsyncError(
  async function (req, res, next) {
    // 1. Get a single tour by id
    const tour = await TourModel.findById(req.params.id).populate(
      "guides"
    );

    if (!tour) throw new AppError("No such document ID found", 404);

    // 2. Get all reviews for that Tour
    const reviews = await ReviewModel.find({
      tour: req.params.id,
    }).populate("user");

    res.render("tour", { tour, reviews });
  },
  { renderErrOnView: true }
);

exports.logIn = catchAsyncError(
  async function (req, res, next) {
    res.render("login");
  },
  { renderErrOnView: true }
);

exports.signUp = catchAsyncError(
  async function (req, res, next) {
    res.render("signup");
  },
  { renderErrOnView: true }
);

exports.getAccount = catchAsyncError(
  async function (req, res, next) {
    if (!res.locals.user) res.redirect("/");

    res.render("editMe");
  },
  { renderErrOnView: true }
);

exports.forgetPassword = catchAsyncError(
  async function (req, res, next) {
    res.render("forgetPass");
  },
  { renderErrOnView: true }
);

exports.resetPassword = catchAsyncError(
  async function (req, res, next) {
    const token = req.params.token;
    res.render("resetPass", { token });
  },
  { renderErrOnView: true }
);

exports.updateTour = catchAsyncError(
  async function (req, res, next) {
    if (
      res.locals.user &&
      ["admin", "lead_guide"].includes(res.locals.user.role)
    )
      res.render("updateTour");

    res.redirect("/");
  },
  { renderErrOnView: true }
);

exports.manageUsers = catchAsyncError(
  async function (req, res, next) {
    if (res.locals.user && res.locals.user.role === "admin")
      res.render("manageUsers");

    res.redirect("/");
  },
  { renderErrOnView: true }
);

exports.showMyBookings = catchAsyncError(
  async function (req, res, next) {
    if (!res.locals.user) res.redirect("/");

    //  1. Get All Tours
    const bookings = await bookingModel.find({ user: res.locals.id });
    const heading = "MY BOOKINGS";

    res.render("bookings", { tours: bookings, heading });
  },
  { renderErrOnView: true }
);

// Displaying messages after successfull Stripe checkout
exports.handleStripeMessage = (req, res, next) => {
  res.locals.stripeMsg = undefined;
  if (req.query.alert === "booking")
    res.locals.stripeMsg =
      "Booking successful! Check your email for confirmation!";
  next();
};
