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

exports.getOneMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return next(new appError("Requested message not fund.", 404));
  }

  return res.status(200).json({
    message: "Requested message found successfully.",
    status: 200,
    data: message,
  });
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find();
  return res.status(200).json({
    message: "All messages found successfully.",
    status: 200,
    length: messages.length,
    data: messages,
  });
});

