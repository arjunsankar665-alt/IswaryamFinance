import Product from '../../models/product.model.js';
import { slugify } from '../../utils/slugify.js';

const buildFilters = query => {
  const filters = { status: 'active' };
  if (query.category && query.category !== 'all') {
    filters.category = query.category;
  }
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filters.$or = [{ name: regex }, { sku: regex }];
  }
  return filters;
};

export async function listPublicProducts(req, res, next) {
  try {
    const { limit = 50, page = 1 } = req.query;
    const perPage = Math.min(Number(limit) || 50, 100);
    const skip = (Number(page) - 1) * perPage;
    const filters = buildFilters(req.query ?? {});
    const [total, products] = await Promise.all([
      Product.countDocuments(filters),
      Product.find(filters)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean()
    ]);
    res.json({ success: true, data: products, total });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const slug = slugify(req.params.slug);
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}
