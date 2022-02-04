const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const AppError = require("../errors/customErrors.js");

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

exports.setLocalUser = function (req, res, next) {
  // Global variable accessed in the view
  // Living only for the lifetime of the request
  res.locals.user = undefined;
  next();
};

exports.verifyLoggedUser = catchAsyncError(
  async function (req, res, next) {
    let token = req.cookies.jwt;

    // 1.Check for token
    if (token) {
      // 2. Verify Token
      const decoded = verifyToken(token);

      // 3. Check if user still exists
      const user = await UserModel.findById(decoded.id).select(
        "+role +lastChanged"
      );
      if (!user) return next();

      // 4. Check if password has been changed after token was created
      const isChanged = user.changedPassAfter(decoded);

      if (isChanged) return next();

      // Update variable
      res.locals.user = user;
      return next();
    }
    return next();
  },
  { renderErrOnView: true }
);
