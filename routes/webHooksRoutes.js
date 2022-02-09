const express = require("express");
const bookingController = require("../controller/bookingController.js");

const router = express.Router();

// Endpoint for receiving webhooks on successful payments
// It's in a separate file because it needs to parse the raw request body
router.post(
  "/stripe-webhooks",
  express.raw({ type: "application/json" }),
  bookingController.receivePaymentHook
);

module.exports = router;
