import { Router } from 'express';

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

export default router;
