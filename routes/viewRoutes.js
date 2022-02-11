const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController.js");
const viewAuthController = require("../controller/viewAuthController.js");
const AppError = require("../errors/customErrors.js");

router.use(
  viewAuthController.setLocalUser,
  viewAuthController.verifyLoggedUser
);

router
  .route("/")
  .get(
    viewController.handleStripeMessage,
    viewController.showOverview
  );
router.route("/sign-up").get(viewAuthController.signUp);
router.route("/tours/:id").get(viewController.showTour);
router.route("/login").get(viewAuthController.logIn);
router.route("/reset-pass").get(viewAuthController.forgetPassword);
router
  .route("/reset-pass/:token")
  .get(viewAuthController.resetPassword);
router.route("/me").get(viewController.getAccount);
router.route("/my-bookings").get(viewController.showMyBookings);

// Admin and Tour_guides only
router.route("/edit/tours").get(viewController.updateTour);
router.route("/edit/users").get(viewController.manageUsers);

router.all("*", (req, res, next) => {
  const err = new AppError("Could not find that page", 404);
  err.onView = true;
  next(err);
});

module.exports = router;
