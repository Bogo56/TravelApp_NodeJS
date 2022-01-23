const SearchFeatures = require("../utils/apiEnhancements.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const filterObj = require("../utils/reqUtils.js");
const AppError = require("../errors/customErrors.js");

/** Using factory functions for all route handlers
 *  that are similar enough. Functions that do
 *  not qualify for factory functions are defined
 *  independently.
 */

exports.getAll = (Model, useParams = false) => {
  return catchAsyncError(async function (req, res) {
    const queryStr = req.query;

    // To allow filtering of results by url parameters
    //  ../:tourId/reviews
    let filter = {};
    if (useParams && req.params)
      filter = filterObj(req.params, ...useParams);

    const result = await new SearchFeatures(
      Model.find(filter),
      queryStr
    )
      .filter()
      .limitFields()
      .paginate()
      .sort()
      .execute();

    // SEND RESPONSE
    res.status(200).json({
      status: "Success",
      results: result.length,
      data: result,
    });
  });
};

exports.getOne = (Model, populateOpts = false) => {
  return catchAsyncError(async function (req, res) {
    const id = req.params.id;
    const query = Model.findById(id);
    if (populateOpts) query.populate(populateOpts);

    const result = await query;

    if (!result) throw new AppError("No such document ID found", 404);

    res.status(200).json({
      status: "Success",
      data: result,
    });
  });
};

exports.createOne = (Model, filterData = false) => {
  return catchAsyncError(async function (req, res) {
    let info;
    filterData
      ? (info = filterObj(req.body, ...filterData))
      : (info = req.body);

    const result = await Model.create(info);

    res.status(201).json({
      status: "Success",
      time: req.time,
      data: result,
    });
  });
};

exports.updateOne = (Model, filterData = false) => {
  return catchAsyncError(async function (req, res) {
    const id = req.params.id;
    let info;
    filterData
      ? (info = filterObj(req.body, ...filterData))
      : (info = req.body);

    const result = await Model.findByIdAndUpdate(id, info, {
      new: true,
      runValidators: true,
    });

    if (!result) throw new AppError("No such document ID found", 404);

    res.status(200).json({
      status: result,
      time: req.time,
      data: result,
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsyncError(async function (req, res) {
    const id = req.params.id;

    const result = await Model.findByIdAndDelete(id);

    if (!result) throw new AppError("No such document ID found", 404);

    res.status(200).json({
      status: "Success",
      number: req.time,
      data: null,
    });
  });
};
