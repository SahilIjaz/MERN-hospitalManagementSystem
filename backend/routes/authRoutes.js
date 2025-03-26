const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");


router.route("/sign-Up").post(authControllers.signUp);


router.route("/otp-verification").post(authControllers.otpVerification);

router.route("/resend-otp").post(authControllers.resendOtp);


router.route("/log-in").post(authControllers.logIn);


router.route("/forgot-password").post(authControllers.forgotPassword);


router
  .route("/forgot-verification")
  .post(authControllers.changePasswordVerification);


router.route("/new-password").post(authControllers.changePassword);
router.route("/social-log-in").post(authControllers.socialLogin);


router.route("/log-out").post(authControllers.protect, authControllers.logOut);
module.exports = router;
