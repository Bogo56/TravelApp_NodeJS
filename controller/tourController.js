const TourModel = require("../model/tourModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const factory = require("./handlerFactories.js");

exports.topFiveTours = catchAsyncError(async function (
  req,
  res,
  next
) {
  req.query = {
    sort: "rating,price",
    limit: 5,
    fields: "price,summary,rating,difficulty",
  };
  next();
});

exports.getAllTours = factory.getAll(TourModel);

exports.addNewTour = factory.createOne(TourModel);

exports.getTour = factory.getOne(
  TourModel,
  (populateOpts = { path: "reviews" })
);

exports.updateTour = factory.updateOne(TourModel);

exports.deleteTour = factory.deleteOne(TourModel);
