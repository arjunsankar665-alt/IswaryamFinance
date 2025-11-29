import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';

export const authenticate = async (req, res, next) => {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

	if (!token) {
		return res.status(401).json({ success: false, message: 'Authentication token missing.' });
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(payload.sub).select('-passwordHash');
		if (!user) {
			return res.status(401).json({ success: false, message: 'User not found.' });
		}
		req.user = user;
		return next();
	} catch (error) {
		return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
	}
};
