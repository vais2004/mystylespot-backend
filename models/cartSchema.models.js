const mongoose = require("mongoose");

// Cart Schema
const cartSchema = new mongoose.Schema({
    _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Outfit', // Reference to the products collection (optional, but useful)
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  rating: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});


const Cart = mongoose.model("Cart", cartSchema);


module.exports = Cart;
