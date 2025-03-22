const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");

router.route("/send-message").post(messageControllers.createMessage);

module.exports = router;
