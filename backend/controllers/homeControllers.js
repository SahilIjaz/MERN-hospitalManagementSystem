const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new appError("Requested user was not found.", 404));
  }

  return res.status(200).jsn({
    message: "requested user found successfully.",
    status: 200,
    data: user,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  let users;
  if (!type) {
    users = await User.find();
  } else {
    users = await User.find({ role: type });
  }

  return res.status(200).json({
    message: type ? `all ${type}s found` : "All users found",
    status: 200,
    length: users.length,
    data: users,
  });
});



