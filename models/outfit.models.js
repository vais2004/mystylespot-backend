const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids"],
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "XL", "XXL"],
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Outfit = mongoose.model("Outfit", OutfitSchema);

module.exports = Outfit;
