const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Subcategory Name is Mendatory"],
    },
    pic: {
      type: String,
      required: [true, "Subcategory Pic is Mendatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Subcategory = mongoose.model("Subcategory", SubcategorySchema);

module.exports = Subcategory;
