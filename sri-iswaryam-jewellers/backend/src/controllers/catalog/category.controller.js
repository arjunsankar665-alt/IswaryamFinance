import Category from '../../models/category.model.js';

export async function listPublicCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}
