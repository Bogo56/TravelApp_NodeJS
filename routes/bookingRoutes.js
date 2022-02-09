const express = require("express");
const authController = require("../controller/authController.js");
const bookingController = require("../controller/bookingController.js");

const router = express.Router();

// Protect all routes after this router
router.use(authController.protectRoute);

//  Creating a payment session in Strype
router.post(
  "/create-checkout-session/:tourId",
  bookingController.createBookingSession
);

// Restrict all routes after this router to admins only
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.route("/:id").delete(bookingController.deleteBooking);

module.exports = router;
