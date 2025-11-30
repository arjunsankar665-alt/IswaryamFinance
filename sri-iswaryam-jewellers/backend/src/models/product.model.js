import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    categoryName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'active', 'inactive', 'archived'], default: 'draft' },
    purity: { type: String, default: '22K' },
    weight: { type: Number, default: 0 },
    heroImage: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    description: { type: String, default: '' }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

ProductSchema.pre('validate', function handleProductSlug() {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  if (!this.categoryName && this.category) {
    this.categoryName = this.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
