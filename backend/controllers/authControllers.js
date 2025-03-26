const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const util = require("util");
const jwt = require("jsonwebtoken");
const otpGenerator = require("../utils/otpGenerator");
const signToken = require("../utils/tokenGenerator");
const { socialChecks } = require("../utils/socialLogInChecks");
const User = require("../models/userModel");
const { logInChecks } = require("../utils/logInChecks");
const Token = require("../models/tokenModel");

exports.socialLogin = catchAsync(async (req, res, next) => {
  const { email, account, deviceId, fcmToken } = req.body;
  if (!email) {
    return next(new appError("Provide email for social login", 400));
  }
  if (!account) {
    return next(new appError("Provide your account type.", 400));
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    user = await User.create({
      ...JSON.parse(JSON.stringify(req.body)),
      email,
      isVerified: true,
      role: account,
      password: "default1234",
    });
  }
  user.isActive = true;
  await user.save();
  const act = socialChecks(user);

  const { accessToken, refreshToken } = await signToken(user._id);

  const new_token = await Token.create({
    accessToken,
    refreshToken,
    deviceId,
    fcmToken,
    person: user._id,
  });

  console.log("NEW TOKEN IS : ", new_token);
  if (!new_token) {
    return next(new appError("Token document not created.", 400));
  }
  res.status(200).json({
    message: "Social logIn successfully.",
    status: 200,
    accessToken,
    refreshToken,
    act,
    user,
  });
});
exports.signUp = catchAsync(async (req, res, next) => {
  let user;
  const { email, password, confirmPassword, account, fcmToken, deviceId } =
    req.body;
  if (
    !(email || password || confirmPassword || account || fcmToken || deviceId)
  ) {
    return next(
      new appError(
        "Any of these email, password, confirmPassword, account, fcmToken, deviceId is missing.",
        400
      )
    );
  }

  user = await User.findOne({ email })
    .select("isDeleted")
    .setOptions({ skipPreHook: true });

  console.log("USER IS : ", user);
  if (user) {
    return next(new appError("User with this email already exists."));
  }
  console.log("CONFIRM PASSWORD DIS : ", confirmPassword);
  user = await User.create({
    email,
    password,
    confirmPassword,
    role: account,
  });
  if (!user) {
    return next(new appError("User was not created.", 400));
  }

  const otp = await otpGenerator(user);
  user.otp = otp;
  user.otpExpiration = Date.now() + 1 * 60 * 1000;
  user.isActive = true;
  user.isOnline = true;
  await user.save();

  const newToken = await Token.create({
    deviceId,
    fcmToken,
    person: user._id,
  });

  if (!newToken) {
    return next(new appError("Token was not created .", 400));
  }
  console.log("USER CREATED");
  const act = logInChecks(user);

  res.status(200).json({
    message: "OTP sent at your Email address.",
    status: 200,
    act,
    user,
  });
});

exports.otpVerification = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  let act;
  if (!(email, otp)) {
    return next(
      new appError("Both email and otp are required in OTP verification.", 400)
    );
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new appError("User with this email do-not exist.", 404));
  }

  act = logInChecks(user);

  if (user.isVerified === true) {
    return res.status(200).json({
      message: "Your email has been verified.",
      status: 200,
      act,
      user,
    });
  }

  if (user.otpExpiration < Date.now()) {
    return next(new appError("OTP expired, request for new one.", 400));
  }

  console.log("THE USER IS  BEFORE VERIFICATION :", user);
  if (user.otp !== otp) {
    return next(new appError("OTP is in-valid, provide valid otp.", 400));
  }
  user.isVerified = true;

  await user.save();

  const { accessToken, refreshToken } = await signToken(user);
  const token = await Token.findOne({
    person: user._id,
  });

  if (!token) {
    newToken = await Token.create({
      person: user._id,
      accessToken,
      refreshToken,
    });

    if (!newToken) {
      return next(
        new appError("New token was not created for this user.", 400)
      );
    }
  }
  token.accessToken = accessToken;
  token.refreshToken = refreshToken;

  await token.save();

  act = logInChecks(user);

  res.status(200).json({
    message: "Email has been verified.",
    status: 200,
    accessToken,
    refreshToken,
    act,
    user,
  });
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("User with this email not found.", 404));
  }

  if (user.otpExpiration > Date.now()) {
    return next(new appError("Wait for 60 seconds.", 400));
  }
  const otp = await otpGenerator(user);
  user.otp = otp;

  user.otpExpiration = Date.now() + 1 * 60 * 1000;
  await user.save();

  const act = logInChecks(user);

  res.status(200).json({
    message: "OTp resent at your email address.",
    status: 200,
    act,
    user,
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  console.log("Entered.");
  const { email, password, fcmToken, deviceId, account } = req.body;

  if (!(email, password, fcmToken, deviceId)) {
    return next(
      new appError("Email ,password, fcmToken or deviceId not provided.", 400)
    );
  }
  console.log("BEFORE FIND ONE");
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new appError("Requested user not found.", 400));
  }

  if (user.role !== account) {
    return next(
      new appError(
        `The provided email does not correspond to a(n) ${account}.`,
        400
      )
    );
  }
  const passwordCorrect = await user.checkPassword(password, user.password);
  if (!passwordCorrect) {
    return next(new appError("Password is in-correct !", 404));
  }
  const { accessToken, refreshToken } = await signToken(user);

  const token1 = await Token.findOne({
    person: user._id,
    fcmToken,
    deviceId,
  });

  if (!token1) {
    const newToken = await Token.create({
      person: user._id,
      fcmToken: fcmToken,
      deviceId,
      accessToken,
      refreshToken,
    });
    if (!newToken) {
      return next(new appError("New Token not created.", 400));
    }
  } else {
    token1.fcmToken = fcmToken;
    token1.deviceId = deviceId;
    await token1.save();
  }

  const act = logInChecks(user);
  res.status(200).json({
    message: "User logged-in successfully.",
    status: 200,
    act,
    accessToken,
    refreshToken,
    user,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new appError("Provide email of user.", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("User with this email do-not exists.", 404));
  }
  const otp = await otpGenerator(user);
  user.otp = otp;
  user.otpExpiration = Date.now() + 1 * 60 * 1000;
  await user.save();
  const act = logInChecks(user);
  res.status(200).json({
    message: "OTP sent at your email address.",
    status: 200,
    act,
    user,
  });
});

exports.changePasswordVerification = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!(otp || email)) {
    return next(new appError("Plz! provide OTP.", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError("Requested user not found.", 404));
  }
  if (user.otpExpiration < Date.now()) {
    return next(new appError("OTP expired,request for new one.", 400));
  }
  if (user.otp !== otp) {
    return next(new appError("Provide valid OTP.", 400));
  }
  user.forgotVerification = true;
  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save();
  const act = logInChecks(user);
  res.status(200).json({
    message: "OTP verified successfully.",
    status: 200,
    act,
    user,
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { newPassword, confirmPassword, email } = req.body;
  if (!(newPassword, confirmPassword)) {
    return next(
      new appError("Both password and confirmPassword should be provided.", 400)
    );
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new appError("Requested user not found.", 404));
  }

  if (!user.forgotVerification) {
    return next(
      new appError("Kindly , verify your Email by requesting OTP.", 400)
    );
  }
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();
  res.status(200).json({
    message: "password changed successfully.",
    status: 200,
    user,
  });
});

exports.refreshTokenGenerator = catchAsync(async (req, res, next) => {
  const tokenRefresh = req.params.refreshToken;
  const verifyToken = await util.promisify(jwt.verify)(
    tokenRefresh,
    process.env.JWT_SECRET
  );

  const token = await Token.findOne({
    person: verifyToken.id,
  });
  if (!token) {
    return next(new appError("User not exists.", 404));
  }
  const user = await User.findById(verifyToken.id);
  if (!user) {
    return next(new appError("User do-nt exists.", 404));
  }
  const { accessToken, refreshToken } = await signToken(user._id);
  token.refreshToken = refreshToken;
  await token.save();
  res.status(200).json({
    message: "Refresh token generated successfully.",
    status: 200,
    accessToken,
    refreshToken,
    user,
  });
});

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

exports.logOut = catchAsync(async (req, res, next) => {
  const token = await Token.findOneAndDelete({
    person: req.user,
    deviceId: req.body.deviceId,
  });

  if (!token) {
    return next(new appError("No log-in record against this user.", 400));
  }

  req.user.isActive = false;
  await req.user.save();

  if (!token) {
    return next(new appError("Token not found for this person !", 404));
  }
  res.status(201).json({
    message: "user logged Out successfully !",
    status: 201,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new appError("email not entered ", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new appError("user not found with this email !", 404));
  }
  await user.save();
  const checkingTime = Date.now();
  if (checkingTime < user.otpExpiration) {
    return next(new appError("wait for 60 seconds to get OTP again.", 400));
  }
  const OTp = await otpGenerator({ email });
  user.otpExpiration = Date.now() + 1 * 60 * 1000;
  user.otp = OTp;
  await user.save();
  console.log("OTP IS : ", OTp);
  res.status(200).json({
    message: "OTP send at your email address for deleting account ",
    status: 200,
    otpSent: OTp,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    return next(new appError("otp was not provided !", 400));
  }
  console.log("USER IS : ", req.user);

  console.log("USER IS : ", req.user._id);
  const user = await User.findById(req.user._id);
  if (user.otp !== otp) {
    return next(new appError("Provided OTp is not correct .", 400));
  }

  user.isDeleted = true;
  user.isActive = false;
  console.log("USER DELETED SUCCESSFULLY", user);
  await user.save();
  res.status(201).json({
    message: "You account has been deleted",
    success: true,
    status: 201,
  });
});
