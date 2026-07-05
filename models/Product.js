import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title.'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price.'],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    costPerItem: {
      type: Number,
      min: 0,
    },
    SKU: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    inventory: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    vendor: {
      type: String,
      trim: true,
    },
    productType: {
      type: String,
      trim: true,
    },
    variants: [
      {
        size: String,
        color: String,
        inventory: Number,
        price: Number,
      },
    ],
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title if not provided
ProductSchema.pre('save', function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
