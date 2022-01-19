const TourModel = require("../model/tourModel.js");
const SearchFeatures = require("../utils/apiEnhancements.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

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

exports.getAllTours = catchAsyncError(async function (req, res) {
  const queryStr = req.query;
  const result = await new SearchFeatures(TourModel.find(), queryStr)
    .filter()
    .limitFields()
    .paginate()
    .sort()
    .execute();

  // SEND RESPONSE
  res.status(200).json({
    status: "Success",
    time: req.time,
    results: result.length,
    data: result,
  });
});

exports.addNewTour = catchAsyncError(async function (req, res) {
  const result = await TourModel.create(req.body);
  res.status(201).json({
    status: "Success",
    time: req.time,
    data: result,
  });
});

exports.getTour = catchAsyncError(async function (req, res) {
  const id = req.params.id;

  const result = await TourModel.findById(id);
  res.status(200).json({
    status: "Success",
    time: req.time,
    data: result,
  });
});

exports.updateTour = catchAsyncError(async function (req, res) {
  const id = req.params.id;
  const info = req.body;

  const result = await TourModel.findByIdAndUpdate(id, info, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: result ? "Success" : "Failed",
    time: req.time,
    data: result || "No such ID",
  });
});

exports.deleteTour = catchAsyncError(async function (req, res) {
  const id = req.params.id;

  await TourModel.findByIdAndDelete(id);
  res.status(200).json({
    status: "Success",
    time: req.time,
    data: null,
  });
});
