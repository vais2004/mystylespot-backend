const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: String,
      mobile: String,
      flat: String,
      area: String,
      street: String,
      landmark: String,
      pincode: String,
      state: String,
      defaultAddress: Boolean,
    },
    paymentMethod: String,
    items: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
