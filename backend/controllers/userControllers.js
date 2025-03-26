const User = require("../models/userModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createProfile = catchAsync(async (req, res, next) => {
  let data = ({
    phoneNumber,
    country,
    avatar,
    fullName,
    location,
    preference,
    designation,
    serviceCharges,
    medicalLicense,
  } = req.body);
  let user;
  if (req.user.role === "admin") {
    data = { phoneNumber, country, avatar, fullName, location };
    user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });
  }
  if (req.user.role === "patient") {
    data = { phoneNumber, country, avatar, fullName, location, preference };
    user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });
  }
  if (req.user.role === "doctor") {
    data = {
      phoneNumber,
      country,
      avatar,
      fullName,
      location,
      designation,
      serviceCharges,
      medicalLicense,
    };
    user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });
  }

  if (!user) {
    return next(new appError("User profile was not created.", 400));
  }

  return res.status(200).json({
    message: `Profile for ${req.user.role} created successfully.`,
    status: 200,
    data: user,
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  let data = ({
    phoneNumber,
    country,
    avatar,
    fullName,
    location,
    preference,
    designation,
    serviceCharges,
    medicalLicense,
  } = req.body);
  let user;
  if (req.user.role === "admin") {
    data = { phoneNumber, country, avatar, fullName, location };
    user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });
  }
  if (req.user.role === "patient") {
    data = { phoneNumber, country, avatar, fullName, location, preference };
    user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });
  }
  if (req.user.role === "doctor") {
    data = {
      phoneNumber,
      country,
      avatar,
      fullName,
      location,
      designation,
      serviceCharges,
      medicalLicense,
    };
    user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });
  }

  if (!user) {
    return next(new appError("User profile was not updated.", 400));
  }

  return res.status(200).json({
    message: `Profile for ${req.user.role} updated successfully.`,
    status: 200,
    data: user,
  });
});
