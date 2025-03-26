const express = require("express");
const router = express.Router();
const messageControllers = require("../controllers/messageControllers");

router.route("/send-message").post(messageControllers.createMessage);

router.route("/get-one-message/:id").get(messageControllers.getOneMessage);

router.route("/get-all-messages").get(messageControllers.getAllMessages);

router.route("/update-message/:id").patch(messageControllers.updateMessage);

router
  .route("/delete-one-message/:id")
  .delete(messageControllers.deleteMessage);

router.route("/delete-all-messages").delete(messageControllers.getAllMessages);
module.exports = router;
