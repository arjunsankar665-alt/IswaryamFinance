import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import adminRoutes from './routes/admin.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import liveRatesRoutes from './routes/live-rates.routes.js';
import { connectDB } from './config/db.js';
import { seedAdminData } from './data/seedAdmin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://iswaryam-angular.onrender.com',
    'https://www.iswaryamjewellers.com',
    'https://sri-iswaryam.onrender.com',
    'http://localhost:4200',
    'http://localhost:4300'
  ],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', catalogRoutes);
app.use('/api/live-rates', liveRatesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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