const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const filterObj = require("../utils/reqUtils.js");
const AppError = require("../errors/customErrors.js");
const factory = require("./handlerFactories.js");

exports.setLoggedUser = (req, res, next) => {
  if (req.user) req.params.id = req.user.id;
  next();
};

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

exports.deactivateLoggedUser = catchAsyncError(async function (
  req,
  res
) {
  const id = req.user.id;

  await UserModel.findByIdAndUpdate(id, { active: false });

  res.status(200).json({
    status: "Success",
    number: req.time,
    data: null,
  });
});

exports.getAllUsers = factory.getAll(UserModel);

exports.createUser = factory.createOne(
  UserModel,
  (filterData = ["email", "name", "photo", "password", "confirmPass"])
);

exports.getUser = factory.getOne(UserModel);

exports.updateUser = factory.updateOne(
  UserModel,
  (filterData = ["email", "name", "photo"])
);

exports.deleteUser = factory.deleteOne(UserModel);
