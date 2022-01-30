const reviewModel = require("../model/reviewModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const factory = require("./handlerFactories.js");

exports.getAllReviews = factory.getAll(reviewModel, {
  useParams: ["tour"],
});

exports.checkForParams = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tour;
  req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(reviewModel, {
  filterData: ["rating", "text", "tour", "user"],
});

exports.getReview = factory.getOne(reviewModel);

exports.updateReview = factory.updateOne(reviewModel, {
  filterData: ["rating", "text"],
});

exports.deleteReview = factory.deleteOne(reviewModel);
