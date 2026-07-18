const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is Mendatory"],
    },
    maincategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maincategory",
      required: [true, "Maincategory Id is Mendatory"],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: [true, "Subcategory Id is Mendatory"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand Id is Mendatory"],
    },
    color: {
      type: Array,
      required: [true, "Product Color is Mendatory"],
    },
    size: {
      type: Array,
      required: [true, "Product Size is Mendatory"],
    },
    basePrice: {
      type: Number,
      required: [true, "Product Base Price is Mendatory"],
    },
    discount: {
      type: Number,
      required: [true, "Discount on Product is Mendatory"],
    },
    finalPrice: {
      type: Number,
      required: [true, "Product Final Price is Mendatory"],
    },
    stock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Product Stock Quantity is Mendatory"],
    },
    description: {
      type: String,
      default: "",
    },
    pic: {
      type: Array,
      required: [true, "Product Pic is Mendatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
