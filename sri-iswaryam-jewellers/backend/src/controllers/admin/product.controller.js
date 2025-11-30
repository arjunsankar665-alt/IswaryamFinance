import Product from '../../models/product.model.js';
import Category from '../../models/category.model.js';
import { slugify } from '../../utils/slugify.js';

const buildQuery = ({ search, category, status }) => {
  const query = {};
  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ name: regex }, { sku: regex }];
  }
  if (category && category !== 'all') {
    query.category = category;
  }
  if (status && status !== 'all') {
    query.status = status;
  }
  return query;
};

export async function listProducts(req, res, next) {
  try {
    const query = buildQuery(req.query ?? {});
    const products = await Product.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

const enrichWithCategory = async payload => {
  if (!payload.category) {
    throw new Error('Category is required');
  }
  const category = await Category.findOne({
    $or: [{ slug: payload.category }, { _id: payload.category }]
  }).lean();
  if (!category) {
    const error = new Error('Invalid category reference');
    error.statusCode = 400;
    throw error;
  }
  return {
    ...payload,
    category: category.slug,
    categoryName: category.name
  };
};

export async function createProduct(req, res, next) {
  try {
    const payload = await enrichWithCategory(req.body || {});
    payload.slug = slugify(payload.slug || payload.name);
    const exists = await Product.findOne({ slug: payload.slug });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Product slug already exists' });
    }
    const product = await Product.create(payload);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    let payload = req.body || {};
    if (payload.category) {
      payload = await enrichWithCategory(payload);
    }
    if (payload.name && !payload.slug) {
      payload.slug = slugify(payload.name);
    }
    if (payload.slug) {
      payload.slug = slugify(payload.slug);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}
