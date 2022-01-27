const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController.js");

router.route("/").get(viewController.showOverview);

module.exports = router;
