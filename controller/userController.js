const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

exports.getAllUsers = catchAsyncError(async function (req, res) {
  const result = await UserModel.find();

  res.status(201).json({
    status: "Success",
    number: result.length,
    data: result,
  });
});

exports.createUser = catchAsyncError(async function (req, res) {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPass: req.body.confirmPass,
    lastChanged: req.body.lastChanged,
  };

  const result = await UserModel.create(userData);

  res.status(201).json({
    status: "Success",
    time: req.time,
    data: result,
  });
});

exports.getUser = catchAsyncError(async function (req, res) {
  const id = req.params.id;
  const result = await UserModel.findById(id);

  res.status(201).json({
    status: "Success",
    data: result,
  });
});

exports.updateUser = catchAsyncError(async function (req, res) {
  const id = req.params.id;
  const updateData = req.body;

  const result = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: "Success",
    data: result,
  });
});

exports.deleteUser = catchAsyncError(async function (req, res) {
  const id = req.params.id;
  const result = await UserModel.findByIdAndDelete(id);

  res.status(200).json({
    status: "Success",
    number: req.time,
    data: null,
  });
});
