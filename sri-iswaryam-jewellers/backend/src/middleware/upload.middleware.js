import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { slugify } from '../utils/slugify.js';

const ensureDir = destination => {
  fs.mkdirSync(destination, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'general';
    const safeCategory = slugify(category) || 'general';
    const uploadPath = path.join(process.cwd(), 'uploads', safeCategory);
    ensureDir(uploadPath);
    // expose relative folders for controller use
    req.uploadCategory = safeCategory;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const baseName = slugify(file.originalname.replace(path.extname(file.originalname), '')) || 'asset';
    const extension = path.extname(file.originalname) || '.jpg';
    cb(null, `${baseName}-${timestamp}${extension}`);
  }
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  }
});
