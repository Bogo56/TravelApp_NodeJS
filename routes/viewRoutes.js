const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController.js");
const viewAuthController = require("../controller/viewAuthController.js");

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
router.route("/sign-up").get(viewController.signUp);
router.route("/tours/:id").get(viewController.showTour);
router.route("/login").get(viewController.logIn);
router.route("/reset-pass").get(viewController.forgetPassword);
router.route("/reset-pass/:token").get(viewController.resetPassword);
router.route("/me").get(viewController.getAccount);
router.route("/my-bookings").get(viewController.showMyBookings);

// Admin and Tour_guides only
router.route("/edit/tours").get(viewController.updateTour);
router.route("/edit/users").get(viewController.manageUsers);

module.exports = router;
