const catchAsyncError = function (fn, options = {}) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      if (options.renderErrOnView) err.onView = true;
      next(err);
    });
  };
};

module.exports = catchAsyncError;
