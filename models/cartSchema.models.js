const mongoose = require("mongoose");

// Cart Schema
const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outfit",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});



const Cart = mongoose.model("Cart", cartSchema);


module.exports = Cart;
