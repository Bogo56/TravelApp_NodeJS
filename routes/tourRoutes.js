const express = require("express");
const router = express.Router();
const tourController = require("../controller/tourController.js");
const authController = require("../controller/authController.js");
const reviewRouter = require("./reviewRoutes.js");
const imgTools = require("../utils/imgTools.js");

// Handle reviews in the reviews router
router.use("/:tour/reviews", reviewRouter);

router
  .route("/top-5-tours")
  .get(tourController.topFiveTours, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protectRoute,
    imgTools.upload.fields([
      { name: "images", maxCount: 3 },
      { name: "imageCover", maxCount: 1 },
    ]),
    imgTools.resizeImages,
    authController.restrictTo("superadmin"),
    tourController.addNewTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protectRoute,
    imgTools.upload.fields([
      { name: "images", maxCount: 3 },
      { name: "imageCover", maxCount: 1 },
    ]),
    imgTools.resizeImages,
    authController.restrictTo("superadmin"),
    tourController.updateTour
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo("superadmin"),
    tourController.deleteTour
  );

module.exports = router;
