import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    category: { type: String, required: true, trim: true },
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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
