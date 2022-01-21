const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const authController = require("../controller/authController.js");

router
  .post("/signup", authController.signUp)
  .post("/login", authController.logIn)
  .post("/forgetPass", authController.forgetPass)
  .patch("/resetPass/:token", authController.resetPass)
  .patch(
    "/updateMyInfo",
    authController.protectRoute,
    userController.updateLoggedUserInfo
  )
  .patch(
    "/updateMyPass",
    authController.protectRoute,
    authController.updateLoggedUserPass
  );

// Routes accessible mostly to admins
router
  .route("/")
  .get(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    userController.getAllUsers
  )
  .post(
    authController.protectRoute,
    authController.restrictTo("admin"),
    userController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    userController.getUser
  )
  .patch(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    userController.updateUser
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
