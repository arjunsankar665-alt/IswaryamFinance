import { Router } from 'express';
import {
	createProduct,
	deleteProduct,
	getProduct,
	listProducts,
	updateProduct
} from '../controllers/admin/product.controller.js';
import { listOrders, updateOrderStatus } from '../controllers/admin/order.controller.js';
import { listUsers } from '../controllers/admin/user.controller.js';
import {
	createCategory,
	deleteCategory,
	listAdminCategories,
	updateCategory
} from '../controllers/admin/category.controller.js';
import {
	createMenu,
	deleteMenu,
	listAdminMenus,
	updateMenu
} from '../controllers/admin/menu.controller.js';
import { imageUpload } from '../middleware/upload.middleware.js';
import { handleImageUpload } from '../controllers/admin/upload.controller.js';

const router = Router();

router.post('/verify-password', (req, res) => {
	const configuredPassword = process.env.ADMIN_PANEL_PASSWORD;
	const { password } = req.body ?? {};

	if (!configuredPassword) {
		return res.status(500).json({
			success: false,
			message: 'Admin panel password is not configured on the server.'
		});
	}

	if (!password) {
		return res.status(400).json({
			success: false,
			message: 'Password is required to continue.'
		});
	}

	if (password !== configuredPassword) {
		return res.status(401).json({
			success: false,
			message: 'Invalid admin password. Please try again.'
		});
	}

	return res.json({
		success: true,
		message: 'Admin access granted.'
	});
});

// Products
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories
router.get('/categories', listAdminCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders
router.get('/orders', listOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', listUsers);

// Menus
router.get('/menus', listAdminMenus);
router.post('/menus', createMenu);
router.put('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);

// Uploads
router.post('/uploads/images', imageUpload.single('file'), handleImageUpload);

export default router;
