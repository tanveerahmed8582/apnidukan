const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is Mandatory"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product Id is Mandatory"],
    },
    message: {
      type: String,
      required: [true, "Message is Mandatory"],
    },
    star: {
      type: Number,
      required: [true, "Star is Mandatory"],
    },
  },
  { timestamps: true },
);

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

module.exports = Testimonial;
