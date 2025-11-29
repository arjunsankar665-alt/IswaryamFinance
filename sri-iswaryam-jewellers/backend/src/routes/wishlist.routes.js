import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist
} from '../controllers/wishlist.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

export default router;
