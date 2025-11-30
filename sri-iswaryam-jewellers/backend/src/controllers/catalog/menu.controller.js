import Menu from '../../models/menu.model.js';

export async function listPublicMenus(req, res, next) {
  try {
    const menus = await Menu.find({ isActive: true })
      .sort({ sortOrder: 1, label: 1 })
      .select('-updatedAt -createdAt')
      .lean();
    res.json({ success: true, data: menus });
  } catch (error) {
    next(error);
  }
}
