const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

module.exports = Wishlist;
