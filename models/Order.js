import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, default: '' },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partially Paid', 'Refunded'],
      default: 'Paid',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['Fulfilled', 'Unfulfilled', 'Pending', 'Returned'],
      default: 'Unfulfilled',
    },
    items: {
      type: Number,
      default: 1,
    },
    channel: {
      type: String,
      default: 'Online Store',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
