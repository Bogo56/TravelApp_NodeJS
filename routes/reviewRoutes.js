const express = require("express");
const reviewController = require("../controller/reviewController.js");
const authController = require("../controller/authController.js");

// Inherit parameters from parent route
const router = express.Router({ mergeParams: true });

// Require authentication for all routes after this router
router.use(authController.protectRoute);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.checkForParams,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("superadmin"),
    reviewController.deleteReview
  );

module.exports = router;
