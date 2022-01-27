const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController.js");

router.route("/").get(viewController.showOverview);
router.route("/:id").get(viewController.showTour);

module.exports = router;
