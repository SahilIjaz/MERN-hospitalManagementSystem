const express = require("express");
const router = express.Router();
const homeControllers = require("../controllers/homeControllers");
const protectMiddleWare = require("../middlewares/protectMiddleware");

router
  .route("/get-one-User/:id")
  .get(protectMiddleWare.protect, homeControllers.getOneUser);

router
  .route("/get-all-users")
  .get(protectMiddleWare.protect, homeControllers.getAllUsers);

module.exports = router;
