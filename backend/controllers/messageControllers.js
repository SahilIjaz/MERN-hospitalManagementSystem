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

exports.updateMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.bdy, {
    new: true,
    runValidators: true,
  });
  if (!message) {
    return next(new appError("Requested message was not updated.", 400));
  }

  return res.status(200).json({
    message: "Requested message updated successfully.",
    status: 200,
    data: message,
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findByIDAndDelete(req.params.id);

  if (!message) {
    return next(new appError("Requested message was not deleted.", 400));
  }

  return res.status(201).json({
    message: "Requested message deleted successfully.",
    status: 201,
    data: null,
  });
});

exports.deleteAllMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.deleteMany();

  return res.status(201).json({
    message: "All messages deleted successfully.",
    status: 201,
    deletedCount: messages.length,
    data: null,
  });
});
