const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const AppError = require("../errors/customErrors.js");
const sendEmail = require("../utils/emails.js");

const signToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

// Protecting routes with JWT token verification
exports.protectRoute = catchAsyncError(async function (
  req,
  res,
  next
) {
  // 1.Check for token
  let token = req.headers.authorization;
  if (!token)
    throw new AppError("Missing access token! Please log in", 401);

  // 2. Verify Token
  token = req.headers.authorization.split(" ")[1];
  const decoded = verifyToken(token);

  // 3. Check if user still exists
  const user = await UserModel.findById(decoded.id).select(
    "+role +lastChanged"
  );
  if (!user) throw new AppError("User does not exist anymore!", 401);

  // 4. Check if password has been changed after token was created
  const isChanged = user.changedPassAfter(decoded);

  if (isChanged)
    throw new AppError(
      "Password has been changed! Please log in again!",
      401
    );

  // Grant Acess to protected Route and attach user info to the request
  req.user = user;
  next();
});

// Restrict access to certain roles
exports.restrictTo = (...roles) => {
  return function (req, res, next) {
    // 1.Check if the user has a permission
    const canAccess = roles.includes(req.user.role);

    if (!canAccess)
      throw new AppError(
        "You don't have permission to access this resource",
        403
      );

    // 2.If true call the next middleware
    next();
  };
};

exports.signUp = catchAsyncError(async function (req, res, next) {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPass: req.body.confirmPass,
  };

  const newUser = await UserModel.create(userData);
  const token = signToken(newUser.id);

  res.status(201).json({
    status: "Success",
    time: req.time,
    data: token,
  });
});

exports.logIn = catchAsyncError(async function (req, res) {
  // 1. Check user credentials
  const { email, password } = req.body;
  const user = await UserModel.checkUser({ email, password });

  if (!user) throw new AppError("Invalid Username or Password", 401);

  // 2. Generate Token
  const token = signToken(user.id);

  res.status(201).json({
    status: "Success",
    user: email,
    token: token,
  });
});

exports.forgetPass = catchAsyncError(async function (req, res, next) {
  // 1.Check is user exists
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) throw new AppError("This email adress does not exist!");

  const data = { ...user._doc };

  // 2. Create expiration token for password restore
  const token = await user.generatePassResetToken();

  // 3. Send email with the url for creating a new password
  data.restoreUrl = `${req.protocol}://${req.hostname}/api/v1/resetPass/${token}`;

  sendEmail(data);

  res.status(201).json({
    status: "Success",
    result:
      "A restoration link has been send to your email! (valid for 10 min)",
  });
});

exports.resetPass = catchAsyncError(async function (req, res, next) {
  // 1.Find user based on the unique token
  const user = await UserModel.findByToken(req.params.token);

  if (!user) throw new AppError("Invalid token!", 403);

  // 2.Check if token has not expired
  const hasExpired = user.validatePassResetToken();

  if (hasExpired)
    throw new AppError("Token has expired! Please try again", 401);

  // 3.Validate and change new Password
  user.password = req.body.password;
  user.confirmPass = req.body.confirmPass || "";
  user.resetExpAt = Date.now();

  await user.save();

  // 4.Generate new jwt token
  const token = signToken(user.id);

  res.status(200).json({
    status: "Success",
    result: "Password reset successfull",
    token: token,
  });
});
