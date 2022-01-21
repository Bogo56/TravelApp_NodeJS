const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController.js");
const authController = require("../controller/authController.js");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authController.protectRoute, reviewController.createReview);

module.exports = router;
