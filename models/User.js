const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is Mendatory"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "User name is Mendatory"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "User Email Address is Mendatory"],
    },
    phone: {
      type: Number,
      required: [true, "User Phone Number is Mendatory"],
    },
    password: {
      type: String,
      required: [true, "Password is Mendatory"],
    },
    address: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      default: "Buyer",
    },
    otpAuthObject: {
      type: Object,
      default: {},
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
