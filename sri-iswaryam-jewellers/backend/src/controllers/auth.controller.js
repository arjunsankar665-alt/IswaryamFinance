import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

const toSafeUser = (user) => ({
  id: user.id || user._id?.toString(),
  name: user.name,
  email: user.email,
  role: user.role || 'user',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const createToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Account already exists for this email.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
  const token = createToken(user.id);

  return res.status(201).json({ success: true, data: { token, user: toSafeUser(user) } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = createToken(user.id);
  return res.json({ success: true, data: { token, user: toSafeUser(user) } });
};

export const me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthenticated.' });
  }

  return res.json({ success: true, data: { user: toSafeUser(req.user) } });
};
