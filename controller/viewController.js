const TourModel = require("../model/tourModel.js");
const ReviewModel = require("../model/reviewModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

exports.showOverview = catchAsyncError(async function (req, res) {
  //  1. Get All Tours
  const tours = await TourModel.find();

  res.render("overview", { tours });
});

exports.showTour = catchAsyncError(async function (req, res) {
  // 1. Get a single tour by id
  const tour = await TourModel.findById(req.params.id).populate(
    "guides"
  );

  // 2. Get all reviews for that Tour
  const reviews = await ReviewModel.find({
    tour: req.params.id,
  }).populate("user");

  console.log(JSON.stringify(tour.locations));

  res.render("tour", { tour, reviews });
});

exports.logIn = catchAsyncError(async function (req, res) {
  res.render("login");
});
