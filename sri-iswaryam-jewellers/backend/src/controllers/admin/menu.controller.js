import Menu from '../../models/menu.model.js';
import { slugify } from '../../utils/slugify.js';

export async function listAdminMenus(req, res, next) {
  try {
    const menus = await Menu.find().sort({ sortOrder: 1, label: 1 }).lean();
    res.json({ success: true, data: menus });
  } catch (error) {
    next(error);
  }
}

export async function createMenu(req, res, next) {
  try {
    const payload = { ...req.body };
    payload.slug = slugify(payload.slug || payload.label);
    const exists = await Menu.findOne({ slug: payload.slug });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Menu slug already exists' });
    }
    const menu = await Menu.create(payload);
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
}

export async function updateMenu(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.label && !updates.slug) {
      updates.slug = slugify(updates.label);
    }
    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }
    const menu = await Menu.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }
    res.json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
}

export async function deleteMenu(req, res, next) {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }
    res.json({ success: true, message: 'Menu deleted' });
  } catch (error) {
    next(error);
  }
}
