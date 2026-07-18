const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
    color: {
      type: String,
      required: [true, "Product Color is Mandatory"],
    },
    size: {
      type: String,
      required: [true, "Product Size is Mandatory"],
    },
    qty: {
      type: Number,
      required: [true, "Quantity is Mandatory"],
      min: [1, "Quantity must be at least 1"],
    },
    total: {
      type: Number,
      required: [true, "Total Amount is Mandatory"],
    },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
