const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },
    avatar: {
      type: String,
    },
    fullName: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: { type: [Number], default: [0.0, 0.0] },
      address: String,
      description: String,
      country: {
        type: String,
      },
    },
    rating: {
      type: Number,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required in user schema."],
      validate: [validator.isEmail, "Provide correct email."],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    preference: {
      type: String,
    },
    designation: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "patient", "doctor"],
    },
    otp: {
      type: Number,
    },
    otpExpiration: {
      type: Number,
    },
    serviceCharges: {
      type: String,
    },
    medicalLicense: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    licenseVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    passwordResetPermission: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isNotification: {
      type: Boolean,
      default: true,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre(/^find/, function (next) {
  this.find({
    $and: [{ isDeleted: false }],
  });
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, function (next) {
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
