const protectMiddleWare = require("../middlewares/protectMiddleware");
const userControllers = require("../controllers/userControllers");
const express = require("express");
const router = express.Router();

router
  .route("/create-profile")
  .post(protectMiddleWare.protect, userControllers.createProfile);

router
  .route("/update-profile")
  .patch(protectMiddleWare.protect, userControllers.updateProfile);

module.exports = router;
