const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const filterObj = require("../utils/reqUtils.js");
const AppError = require("../errors/customErrors.js");

exports.updateLoggedUserInfo = catchAsyncError(async function (
  req,
  res
) {
  // 1.Filter user request
  if (req.body.password)
    throw new AppError(
      "Can't change password in this route! Please use /updateMyPass",
      401
    );

  const userData = filterObj(req.body, "email", "name", "photo");

  // 2. Find user and update Data
  // * req.user is available because of the previous middleware that
  // attaches it to the request after validating the JWT token.
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    userData,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    info: "User updated",
    result: userData,
  });
});

exports.getAllUsers = catchAsyncError(async function (req, res) {
  const result = await UserModel.find();

  res.status(201).json({
    status: "Success",
    number: result.length,
    data: result,
  });
});

exports.createUser = catchAsyncError(async function (req, res) {
  const userData = filterObj(
    req.body,
    "email",
    "name",
    "photo",
    "password",
    "confirmPass"
  );

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
  await UserModel.findByIdAndUpdate(id, { active: false });

  res.status(200).json({
    status: "Success",
    number: req.time,
    data: null,
  });
});
