const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Feature Name is Mendatory"],
    },
    icon: {
      type: String,
      required: [true, "Feature Icon is Mendatory"],
    },
    shortDescription: {
      type: String,
      required: [true, "Feature Short Description is Mendatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Feature = mongoose.model("Feature", FeatureSchema);

module.exports = Feature;
