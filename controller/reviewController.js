const reviewModel = require("../model/reviewModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

exports.getAllReviews = async function (req, res, next) {
  const reviews = await reviewModel.find();

  res.status(200).json({
    status: "Success",
    results: reviews.length,
    data: reviews,
  });
};

exports.createReview = catchAsyncError(async function (
  req,
  res,
  next
) {
  const review = await reviewModel.create(req.body);

  res.status(200).json({
    status: "Success",
    time: req.time,
    data: review,
  });
});
