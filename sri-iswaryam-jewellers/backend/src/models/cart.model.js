import mongoose from 'mongoose';

const { Schema } = mongoose;

const CartItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    inStock: { type: Boolean, default: true },
    category: { type: String },
    attributes: { type: Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export default Cart;
