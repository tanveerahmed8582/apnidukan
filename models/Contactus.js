const mongoose = require("mongoose");

const ContactusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is Mendatory"],
    },
    email: {
      type: String,
      required: [true, "Email Address is Mendatory"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is Mendatory"],
    },
    subject: {
      type: String,
      required: [true, "Subject is Mendatory"],
    },
    message: {
      type: String,
      required: [true, "Message Address is Mendatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Contactus = mongoose.model("Contactus", ContactusSchema);

module.exports = Contactus;
