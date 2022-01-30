const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController.js");
const viewAuthController = require("../controller/viewAuthController.js");

router.route("/login").get(viewController.logIn);
router.route("/").get(viewController.showOverview);
router
  .route("/tours/:id")
  .get(viewAuthController.verifyLoggedUser, viewController.showTour);

module.exports = router;
