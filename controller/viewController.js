const TourModel = require("../model/tourModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

exports.showOverview = catchAsyncError(async function (req, res) {
  res.render("overview");
});

exports.showTour = catchAsyncError(async function (req, res) {
  res.render("tour");
});
