import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the collection.'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slugify helper if not set
CollectionSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
