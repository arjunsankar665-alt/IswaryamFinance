import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { connectDB } from './config/db.js';
import { seedAdminData } from './data/seedAdmin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sample product routes (static)
app.get('/api/products', (req, res) => {
  // Sample products data
  const products = [
    {
      id: '1',
      name: 'Traditional Gold Necklace',
      slug: 'traditional-gold-necklace',
      price: 125000,
      originalPrice: 150000,
      discount: 17,
      images: [
        { thumb: '/assets/images/products/necklace1-thumb.jpg', full: '/assets/images/products/necklace1.jpg', alt: 'Gold Necklace' }
      ],
      category: 'necklaces',
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      weight: '22g',
      purity: '22K'
    },
    {
      id: '2',
      name: 'Diamond Studded Bangles',
      slug: 'diamond-studded-bangles',
      price: 85000,
      originalPrice: 95000,
      discount: 11,
      images: [
        { thumb: '/assets/images/products/bangles1-thumb.jpg', full: '/assets/images/products/bangles1.jpg', alt: 'Diamond Bangles' }
      ],
      category: 'bangles',
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      weight: '18g',
      purity: '18K'
    },
    {
      id: '3',
      name: 'Antique Temple Earrings',
      slug: 'antique-temple-earrings',
      price: 45000,
      originalPrice: 52000,
      discount: 13,
      images: [
        { thumb: '/assets/images/products/earrings1-thumb.jpg', full: '/assets/images/products/earrings1.jpg', alt: 'Temple Earrings' }
      ],
      category: 'earrings',
      rating: 4.9,
      reviewCount: 203,
      inStock: true,
      weight: '8g',
      purity: '22K'
    },
    {
      id: '4',
      name: 'Bridal Gold Set',
      slug: 'bridal-gold-set',
      price: 350000,
      originalPrice: 400000,
      discount: 12,
      images: [
        { thumb: '/assets/images/products/bridal1-thumb.jpg', full: '/assets/images/products/bridal1.jpg', alt: 'Bridal Set' }
      ],
      category: 'bridal',
      rating: 5.0,
      reviewCount: 56,
      inStock: true,
      weight: '85g',
      purity: '22K'
    }
  ];
  
  res.json({ success: true, data: products, total: products.length });
});

app.get('/api/products/:slug', (req, res) => {
  const product = {
    id: '1',
    name: 'Traditional Gold Necklace',
    slug: req.params.slug,
    price: 125000,
    originalPrice: 150000,
    discount: 17,
    description: 'Exquisite traditional gold necklace crafted with intricate designs. Perfect for weddings and special occasions.',
    images: [
      { thumb: '/assets/images/products/necklace1-thumb.jpg', full: '/assets/images/products/necklace1.jpg', alt: 'Gold Necklace Front' },
      { thumb: '/assets/images/products/necklace2-thumb.jpg', full: '/assets/images/products/necklace2.jpg', alt: 'Gold Necklace Side' },
      { thumb: '/assets/images/products/necklace3-thumb.jpg', full: '/assets/images/products/necklace3.jpg', alt: 'Gold Necklace Detail' }
    ],
    category: 'necklaces',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    specifications: {
      weight: '22g',
      purity: '22K',
      length: '18 inches',
      certification: 'BIS Hallmark',
      warranty: '1 Year'
    }
  };
  res.json({ success: true, data: product });
});

app.get('/api/categories', (req, res) => {
  const categories = [
    { id: '1', name: 'Necklaces', slug: 'necklaces', image: '/assets/images/categories/necklaces.jpg', count: 156 },
    { id: '2', name: 'Bangles', slug: 'bangles', image: '/assets/images/categories/bangles.jpg', count: 98 },
    { id: '3', name: 'Earrings', slug: 'earrings', image: '/assets/images/categories/earrings.jpg', count: 234 },
    { id: '4', name: 'Rings', slug: 'rings', image: '/assets/images/categories/rings.jpg', count: 189 },
    { id: '5', name: 'Bridal', slug: 'bridal', image: '/assets/images/categories/bridal.jpg', count: 67 },
    { id: '6', name: 'Chains', slug: 'chains', image: '/assets/images/categories/chains.jpg', count: 112 }
  ];
  res.json({ success: true, data: categories });
});

// Cart endpoints
app.post('/api/cart', (req, res) => {
  res.json({ success: true, message: 'Item added to cart', cartCount: 1 });
});

app.get('/api/cart', (req, res) => {
  res.json({ success: true, data: { items: [], total: 0 } });
});

// Checkout endpoint
app.post('/api/orders', (req, res) => {
  const orderId = 'ORD' + Date.now();
  res.json({ 
    success: true, 
    data: { 
      orderId,
      status: 'confirmed',
      message: 'Order placed successfully!'
    }
  });
});

// Payment endpoint (Razorpay integration placeholder)
app.post('/api/payments/create-order', (req, res) => {
  res.json({
    success: true,
    data: {
      orderId: 'order_' + Date.now(),
      amount: req.body.amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo'
    }
  });
});

app.post('/api/payments/verify', (req, res) => {
  res.json({ success: true, message: 'Payment verified successfully' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminData();
    app.listen(PORT, () => {
      console.log(`🚀 Sri Iswaryam Jewellers API running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();