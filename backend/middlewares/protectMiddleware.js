const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const util = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  console.log(req.headers.authorization);
  if (!req.headers.authorization.startsWith("Bearer")) {
    console.log("HERE ");
    token = req.headers.authorization;

    if (!token) {
      return next(new appError("Log-in in order to get Access!", 401));
    }
    console.log("TOKEN IS AVAILABLE");
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new appError("This user no longer exists.", 401));
    }

    req.user = freshUser;
    next();
  } else {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return next(new appError("Log-in in order to get Access!", 401));
      }
      const decoded = await util.promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next(new appError("This user no longer exists.", 401));
      }
      req.user = freshUser;
      next();
    }
  }
});
