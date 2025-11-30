import Order from '../../models/order.model.js';

export async function listOrders(req, res, next) {
  try {
    const { status } = req.query ?? {};
    const query = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body ?? {};
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}
