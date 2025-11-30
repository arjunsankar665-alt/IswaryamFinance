import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

const sampleProducts = [
  {
    name: 'Heritage Temple Necklace',
    sku: 'PROD-NEC-01',
    category: 'necklaces',
    price: 248000,
    mrp: 279000,
    stock: 6,
    status: 'active',
    purity: '22K',
    weight: 48,
    heroImage: 'assets/Necklace/necklace1.webp',
    gallery: ['assets/Necklace/necklace2.webp', 'assets/Necklace/necklace3.webp'],
    tags: ['Temple', 'Wedding'],
    featured: true,
    description: 'Heritage Temple Necklace crafted in 22K with meticulous detailing.'
  },
  {
    name: 'Aurora Diamond Jhumkas',
    sku: 'PROD-EAR-04',
    category: 'earrings',
    price: 68000,
    mrp: 74500,
    stock: 18,
    status: 'active',
    purity: '18K',
    weight: 14,
    heroImage: 'assets/Earrings/earrings4.webp',
    gallery: ['assets/Earrings/earrings6.webp'],
    tags: ['Diamond', 'Polki'],
    featured: true,
    description: 'Aurora diamond jhumkas with floating Polki lattice.'
  }
];

const sampleOrders = [
  {
    orderNumber: 'ORD-10245',
    customerName: 'Lakshmi R.',
    customerEmail: 'lakshmi@sriswaryam.com',
    channel: 'Web',
    status: 'processing',
    total: 312000,
    expectedDispatch: new Date(),
    shippingProvider: 'BlueDart Priority',
    trackingId: 'BDX234553',
    items: []
  }
];

export async function seedAdminData() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
  }

  const orderCount = await Order.countDocuments();
  if (orderCount === 0) {
    await Order.insertMany(sampleOrders);
  }

}
