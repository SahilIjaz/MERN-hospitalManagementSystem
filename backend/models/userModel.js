const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["food-enthusiast", "chef", "farmer", "admin"],
      required: [true, "Account type is required in user schema."],
    },
    avatar: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: [validator.isEmail, "Plz ! provide a valid E-mail address."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
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
    userName: {
      type: String,
      //   required: [true, "userName is required."],
    },
    location: {
      type: {
        type: String,
        default: "point",
      },
      coordinates: { type: [Number], default: [0.0, 0.0] },
      address: String,
      description: String,
    },

    cuisinePreferences: [{ type: mongoose.Schema.Types.Mixed }],
    dietaryRestrictions: [{ type: mongoose.Schema.Types.Mixed }],
    // cuisinePreferences: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "CuisinePreferences",
    //   },
    // ],
    // dietaryRestrictions: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "DietaryRestrictions",
    //   },
    // ],
    cookingSkillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    socialAccounts: [
      {
        name: {
          type: String,
          trim: true,
        },
        id: {
          type: String,
          trim: true,
        },
      },
    ],
    bio: {
      type: String,
    },
    achievements: [
      {
        achievementTitle: {
          type: String,
        },
        achievementImage: {
          type: [String],
        },
      },
    ],
    additionalInformation: {
      description: {
        type: String,
      },
      image: {
        type: [String],
      },
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    subscriptionType: {
      type: String,
      default: "free",
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isNotification: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: Number,
    },
    otpExpiration: {
      type: Number,
    },
    forgotVerification: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    recipePoints: { type: Number, default: 0 },
    coursePoints: { type: Number, default: 0 },
    challengePoints: { type: Number, default: 0 },
    recipes: { type: Number, default: 0 },
    courses: { type: Number, default: 0 },
    followers: {
      type: Number,
      default: 0,
      min: 0,
    },
    following: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

//password encryption
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

//:::::::::::::::::pre hooks
userSchema.pre(/^find/, function (next) {
  // console.log("BEFORE CHECKING THE CONDITION");
  // const isDeleted = this.getQuery().isDeleted;
  // console.log('THE IS DELETED IS : ', isDeleted);
  // if (isDeleted === true) {
  //   console.log("THE UER HAS DELETED FIELD TRUE");
  //   this.find({
  //     isDeleted: true,
  //   });
  // } else {

  if (this.getOptions().skipPreHook) {
    return next();
  } else {
    this.find({
      isDeleted: false,
    });
  }
  // }
  next();
});

//password checking
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
