const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.types.ObjectId,
      ref: "User",
    },
    requested: {
      type: mongoose.Schema.types.ObjectId,
      ref: "User",
    },
    appointmentData: {
      type: Date,
    },
    appointmentPurpose: {
      type: String,
    },
    appointmentTime: {
      type: Time,
    },
    appointmentType: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
console.log('hello')
appointmentSchema.pre(/^find/, function (next) {
  this.populate({});
  next();
});

const Appointment = new mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;

