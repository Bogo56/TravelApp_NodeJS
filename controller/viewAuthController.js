const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");
const AppError = require("../errors/customErrors.js");

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

exports.verifyLoggedUser = catchAsyncError(async function (
  req,
  res,
  next
) {
  // 1.Check for token
  let token = req.cookies.jwt;
  if (!token)
    throw new AppError("Missing access token! Please log in", 401);

  // 2. Verify Token
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

  // Grant Acess to protected Route
  next();
});
