const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      house: { type: String, required: true },   // Flat, House No.
      area: { type: String, required: true },    // Area, Street, Village
      landmark: { type: String },                // Optional
      pincode: { type: String, required: true },
      town: { type: String, required: true },    // City
      state: { type: String, required: true },
      defaultAddress: { type: Boolean, default: false },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      required: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
