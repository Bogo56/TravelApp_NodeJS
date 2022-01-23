const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const authController = require("../controller/authController.js");

router
  .post("/signup", authController.signUp)
  .post("/login", authController.logIn)
  .post("/forgetPass", authController.forgetPass)
  .patch("/resetPass/:token", authController.resetPass);

// Protect all routes after this router
router.use(authController.protectRoute);

router
  .get("/me", userController.setLoggedUser, userController.getUser)
  .patch("/updateMyInfo", userController.updateLoggedUserInfo)
  .patch("/updateMyPass", authController.updateLoggedUserPass)
  .delete("/deleteMe", userController.deactivateLoggedUser);

// Restrict all routes after this router to admins only
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
