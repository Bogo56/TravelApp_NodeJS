const TourModel = require("../model/tourModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

exports.showOverview = catchAsyncError(async function (req, res) {
  res.render("main");
});
