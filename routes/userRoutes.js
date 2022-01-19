const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const authController = require("../controller/authController.js");

// prettier-ignore

router
.post("/signup",authController.signUp)
.post("/login",authController.logIn)
.post("/forgetPass",authController.forgetPass)
.patch("/resetPass/:token",authController.resetPass)

router
  .route("/")
  .get(
    authController.protectRoute,
    authController.restrictTo("admin", "lead_guide"),
    userController.getAllUsers
  )
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
