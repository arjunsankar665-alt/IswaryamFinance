import { Router } from 'express';
import { listPublicProducts, getProductBySlug } from '../controllers/catalog/product.controller.js';
import { listPublicCategories } from '../controllers/catalog/category.controller.js';
import { listPublicMenus } from '../controllers/catalog/menu.controller.js';

const router = Router();

router.get('/products', listPublicProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/categories', listPublicCategories);
router.get('/menus', listPublicMenus);

export default router;
