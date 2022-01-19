const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController.js");
const authController = require("../controller/authController.js");

router
  .route("/top-5-tours")
  .get(tourController.topFiveTours, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(authController.protectRoute, tourController.addNewTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    tourController.deleteTour
  );

module.exports = router;
