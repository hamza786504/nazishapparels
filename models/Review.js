import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please associate this review with a product.'],
    },
    customerName: {
      type: String,
      required: [true, 'Please provide the customer name.'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating (1-5).'],
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: [true, 'Please provide review text.'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
