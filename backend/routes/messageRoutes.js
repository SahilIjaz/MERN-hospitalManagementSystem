const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");

router.route("/send-message").post(messageControllers.createMessage);

router.route("/get-one-message/:id").get(messageControllers.getOneMessage);

router.route("/get-all-messages").get(messageControllers.getAllMessages);
module.exports = router;
