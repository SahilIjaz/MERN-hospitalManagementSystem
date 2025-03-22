const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Plz! provide a valid email address."],
    },
    phoneNumber: {
      type: Number,
      minLength: [11, "Phone number should be 11 digits long."],
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);
module.exports = Message;
