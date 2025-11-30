import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    category: { type: String },
    heroImage: { type: String }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    channel: { type: String, enum: ['Web', 'In-store', 'App'], default: 'Web' },
    status: { type: String, enum: ['pending', 'processing', 'hallmarking', 'packed', 'shipped', 'delivered'], default: 'pending' },
    total: { type: Number, required: true },
    expectedDispatch: { type: Date },
    shippingProvider: { type: String },
    trackingId: { type: String },
    items: { type: [OrderItemSchema], default: [] }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
