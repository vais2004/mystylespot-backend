const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      flat: { type: String, required: true }, // house number or flat
      area: { type: String, required: true },
      street: { type: String, required: true }, // town or street name
      landmark: { type: String }, // optional
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      defaultAddress: { type: Boolean, default: false },
    },
    paymentMethod: { type: String, required: true },
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

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
