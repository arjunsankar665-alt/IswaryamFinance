import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Category from '../models/category.model.js';

const baseCategories = [
  { name: 'Necklaces', slug: 'necklaces', description: 'Neck adornments' },
  { name: 'Earrings', slug: 'earrings', description: 'Ear jewellery' },
  { name: 'Bangles', slug: 'bangles', description: 'Traditional bangles' },
  { name: 'Rings', slug: 'rings', description: 'Cocktail & daily wear rings' },
  { name: 'Special', slug: 'special', description: 'Limited edition pieces' }
];

const sampleProducts = [
  {
    name: 'Heritage Temple Necklace',
    slug: 'heritage-temple-necklace',
    sku: 'PROD-NEC-01',
    category: 'necklaces',
    categoryName: 'Necklaces',
    price: 248000,
    mrp: 279000,
    stock: 6,
    status: 'active',
    purity: '22K',
    weight: 48,
    heroImage: '',
    gallery: [],
    tags: ['Temple', 'Wedding'],
    featured: true,
    description: 'Heritage Temple Necklace crafted in 22K with meticulous detailing.'
  },
  {
    name: 'Aurora Diamond Jhumkas',
    slug: 'aurora-diamond-jhumkas',
    sku: 'PROD-EAR-04',
    category: 'earrings',
    categoryName: 'Earrings',
    price: 68000,
    mrp: 74500,
    stock: 18,
    status: 'active',
    purity: '18K',
    weight: 14,
    heroImage: '',
    gallery: [],
    tags: ['Diamond', 'Polki'],
    featured: true,
    description: 'Aurora diamond jhumkas with floating Polki lattice.'
  }
];

export async function seedAdminData() {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(baseCategories);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
  }

  const orderCount = await Order.countDocuments();
  if (orderCount === 0) {
    const products = await Product.find().lean();
    const items = products.map(product => ({
      productId: product._id,
      name: product.name,
      quantity: 1,
      price: product.price,
      category: product.category,
      heroImage: product.heroImage
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await Order.create({
      orderNumber: 'ORD-10245',
      customerName: 'Lakshmi R.',
      customerEmail: 'lakshmi@sriswaryam.com',
      channel: 'Web',
      status: 'processing',
      total,
      expectedDispatch: new Date(),
      shippingProvider: 'BlueDart Priority',
      trackingId: 'BDX234553',
      items
    });
  }
}
