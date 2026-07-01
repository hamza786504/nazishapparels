import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name.'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },
    address: {
      type: String,
      trim: true,
    },
    ordersCount: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
CustomerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
