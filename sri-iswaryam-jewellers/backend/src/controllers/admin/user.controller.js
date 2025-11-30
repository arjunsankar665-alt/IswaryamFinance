import User from '../../models/user.model.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
        orders: user.ordersCount ?? 0,
        lifetimeValue: user.lifetimeValue ?? 0,
        joinedOn: user.createdAt,
        lastActive: user.lastLoginAt || user.updatedAt,
        location: user.location || '—'
      }))
    });
  } catch (error) {
    next(error);
  }
}
