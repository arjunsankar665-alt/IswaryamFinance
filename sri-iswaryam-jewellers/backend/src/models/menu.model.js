import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const { Schema } = mongoose;

const MenuSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    url: { type: String, required: true, trim: true },
    display: { type: String, enum: ['link', 'categories'], default: 'link' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    icon: { type: String, default: '' }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

MenuSchema.pre('validate', function setSlug() {
  if (!this.slug && this.label) {
    this.slug = slugify(this.label);
  }
});

const Menu = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
export default Menu;
