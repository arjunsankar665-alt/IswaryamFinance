import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  addItem,
  clearCart,
  getCart,
  moveToWishlist,
  removeItem,
  updateItemQuantity
} from '../controllers/cart.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getCart);
router.post('/', addItem);
router.patch('/:productId', updateItemQuantity);
router.delete('/:productId', removeItem);
router.delete('/', clearCart);
router.post('/:productId/move-to-wishlist', moveToWishlist);

export default router;
