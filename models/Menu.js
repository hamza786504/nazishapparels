import mongoose from 'mongoose';

// ── Sub-document: recursive menu item ────────────────────────────────────────
const MenuItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      enum: ['product', 'collection', 'page', 'custom'],
      default: 'custom',
    },
    resourceId: { type: String, default: '' },
    children: { type: [], default: [] }, // nested items (max depth 2)
  },
  { _id: false }
);

// ── Main Menu Schema ─────────────────────────────────────────────────────────
const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    position: {
      type: String,
      enum: ['header', 'footer', 'sidebar', 'none'],
      default: 'none',
    },
    items: {
      type: [MenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate handle from name before validation
MenuSchema.pre('validate', function () {
  if (!this.handle && this.name) {
    this.handle = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
