const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController.js");
const viewAuthController = require("../controller/viewAuthController.js");

router.use(
  viewAuthController.setLocalUser,
  viewAuthController.verifyLoggedUser
);

router.route("/").get(viewController.showOverview);
router.route("/tours/:id").get(viewController.showTour);
router.route("/login").get(viewController.logIn);
router.route("/me").get(viewController.getAccount);

router.route("/edit/tours").get(viewController.updateTour);

module.exports = router;
