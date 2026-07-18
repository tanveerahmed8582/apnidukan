const mongoose = require("mongoose");

const MaincategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Maincategory Name is Mendatory"],
    },
    pic: {
      type: String,
      required: [true, "Maincategory Pic is Mendatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Maincategory = mongoose.model("Maincategory", MaincategorySchema);

module.exports = Maincategory;
