import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outfit',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

export default mongoose.model('Cart', cartSchema);
