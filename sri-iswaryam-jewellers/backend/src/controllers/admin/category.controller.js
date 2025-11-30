import Category from '../../models/category.model.js';
import { slugify } from '../../utils/slugify.js';

export async function listAdminCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const payload = { ...req.body };
    payload.slug = slugify(payload.slug || payload.name);
    const exists = await Category.findOne({ slug: payload.slug });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Category slug already exists' });
    }
    const category = await Category.create(payload);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name);
    }
    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }
    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}
