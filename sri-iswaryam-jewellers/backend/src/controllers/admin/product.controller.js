import Product from '../../models/product.model.js';

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

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
