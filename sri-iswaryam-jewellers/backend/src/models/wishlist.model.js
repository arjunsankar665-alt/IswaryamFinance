import mongoose from 'mongoose';

const { Schema } = mongoose;

const WishlistItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    price: { type: Number, min: 0 },
    category: { type: String },
    inStock: { type: Boolean, default: true },
    attributes: { type: Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const WishlistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [WishlistItemSchema], default: [] }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;
