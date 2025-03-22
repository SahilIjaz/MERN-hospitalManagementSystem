const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const Message = require("../models/messageModel");

exports.createMessage = catchAsync(async (req, resizeBy, next) => {
  const message = await Message.create(req.body);
  if (!message) {
    return next(new appError("Requested message was nt created.", 400));
  }

  return res.status(200).json({
    message: "Message has been created successfully.",
    status: 200,
    data: message,
  });
});
