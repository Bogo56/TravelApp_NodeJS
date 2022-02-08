const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const AppError = require("../errors/customErrors.js");
const sendEmail = require("../utils/emails.js");
const filterObj = require("../utils/reqUtils.js");

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

const sendToken = function (status, result, token, res) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };
  if (process.env.NODE_ENV === "production")
    cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return res.status(status).json({
    status: "Success",
    msg: result,
  });
};

// Protecting routes with JWT token verification
exports.protectRoute = catchAsyncError(async function (
  req,
  res,
  next
) {
  // 1.Check for token
  let token = req.headers.authorization || req.cookies.jwt;

  if (!token)
    throw new AppError("Missing access token! Please log in", 401);

  // 2. Verify Token
  if (token.startsWith("Bearer")) token = token.split(" ")[1];
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
  const userData = filterObj(
    req.body,
    "email",
    "name",
    "password",
    "confirmPass"
  );

  const newUser = await UserModel.create(userData);
  const token = signToken(newUser.id);

  sendToken(201, userData.email, token, res);
});

exports.logIn = catchAsyncError(async function (req, res) {
  // 1. Check user credentials
  const userData = filterObj(req.body, "email", "password");
  const user = await UserModel.checkUser(userData);

  if (!user) throw new AppError("Invalid Username or Password", 401);

  // 2. Generate Token
  const token = signToken(user.id);

  sendToken(200, userData.email, token, res);
});

exports.logOut = catchAsyncError(async function (req, res) {
  // Invalidate user token
  res
    .status(200)
    .cookie("jwt", "logedout", {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    })
    .json({ status: "Success", msg: "Log out Successfull" });
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
  data.restoreUrl = `${req.protocol}://${req.hostname}:3000/reset-pass/${token}`;

  await sendEmail(data);

  res.status(201).json({
    status: "Success",
    resetToken: token,
    msg: "A restoration link has been send to your email! (valid for 10 min)",
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
  user.confirmPass = req.body.confirmPass;
  user.resetExpAt = Date.now();

  await user.save();

  // 4.Generate new jwt token
  const token = signToken(user.id);

  sendToken(201, "Password Updated", token, res);
});

exports.updateLoggedUserPass = catchAsyncError(async function (
  req,
  res
) {
  // 1.Confirm old password
  const user = await UserModel.checkUser({
    email: req.user.email,
    password: req.body.oldPass,
  });

  if (!user) throw new AppError("Wrong Password", 401);

  // 2.Validate new Password and update
  user.password = req.body.password;
  user.confirmPass = req.body.confirmPass;
  await user.save();

  // 3.Generate new token
  const token = signToken(user.id);

  sendToken(201, "Password Updated", token, res);
});
