const SearchFeatures = require("../utils/apiEnhancements.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const filterObj = require("../utils/reqUtils.js");
const AppError = require("../errors/customErrors.js");

/** Using factory functions for all route handlers
 *  that are similar enough. Functions that do
 *  not qualify for factory functions are defined
 *  independently.
 */

exports.getAll = (Model, options = {}) => {
  return catchAsyncError(async function (req, res) {
    const queryStr = req.query;

    // To allow filtering of results by url parameters
    //  ../:tourId/reviews
    let filter = {};
    if (options.useParams && req.params)
      filter = filterObj(req.params, ...options.useParams);

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

exports.getOne = (Model, options = {}) => {
  return catchAsyncError(async function (req, res) {
    const id = req.params.id;
    const query = Model.findById(id).select(options.selectOpts || "");
    if (options.populateOpts) query.populate(options.populateOpts);

    const result = await query;

    if (!result) throw new AppError("No such document ID found", 404);

    res.status(200).json({
      status: "Success",
      data: result,
    });
  });
};

exports.createOne = (Model, options = {}) => {
  return catchAsyncError(async function (req, res) {
    let info;
    options.filterData
      ? (info = filterObj(req.body, ...options.filterData))
      : (info = req.body);

    const result = await Model.create(info);

    res.status(201).json({
      status: "Success",
      time: req.time,
      data: result,
    });
  });
};

exports.updateOne = (Model, options = {}) => {
  return catchAsyncError(async function (req, res) {
    const id = req.params.id;
    let info;
    options.filterData
      ? (info = filterObj(req.body, ...options.filterData))
      : (info = req.body);

    const result = await Model.findByIdAndUpdate(id, info, {
      new: true,
      runValidators: true,
    });

    if (!result) throw new AppError("No such document ID found", 404);

    res.status(200).json({
      status: "Success",
      time: req.time,
      msg: "Document Updated",
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
      msg: "Deleted",
      number: req.time,
      data: null,
    });
  });
};
