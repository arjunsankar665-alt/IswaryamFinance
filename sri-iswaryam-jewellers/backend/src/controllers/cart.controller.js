import Cart from '../models/cart.model.js';
import Wishlist from '../models/wishlist.model.js';

const ensureCart = async (userId) => {
  const existing = await Cart.findOne({ user: userId });
  if (existing) {
    return existing;
  }
  return Cart.create({ user: userId, items: [] });
};

const formatCart = (cart) => {
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart?._id?.toString(),
    items: items.map((item) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      inStock: item.inStock,
      category: item.category,
      attributes: item.attributes || {}
    })),
    totals: {
      subtotal,
      itemCount: items.length,
      totalQuantity
    },
    updatedAt: cart?.updatedAt
  };
};

const ensureWishlist = async (userId) => {
  const existing = await Wishlist.findOne({ user: userId });
  if (existing) {
    return existing;
  }
  return Wishlist.create({ user: userId, items: [] });
};

export const getCart = async (req, res) => {
  try {
    const cart = await ensureCart(req.user.id);
    return res.json({ success: true, data: formatCart(cart) });
  } catch (error) {
    console.error('getCart error', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch cart.' });
  }
};

export const addItem = async (req, res) => {
  const { productId, name, price, image, slug, quantity = 1, inStock = true, category, attributes = {} } = req.body;
  const normalizedPrice = Number(price);
  const normalizedQuantity = Math.max(1, Number(quantity) || 1);

  if (!productId || !name || Number.isNaN(normalizedPrice)) {
    return res.status(400).json({ success: false, message: 'productId, name and numeric price are required.' });
  }

  try {
    const cart = await ensureCart(req.user.id);
    const existing = cart.items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += normalizedQuantity;
      existing.image = image || existing.image;
      existing.price = normalizedPrice;
      existing.inStock = inStock;
      existing.category = category || existing.category;
      existing.attributes = attributes || existing.attributes;
    } else {
      cart.items.push({
        productId,
        name,
        price: normalizedPrice,
        image,
        slug,
        quantity: normalizedQuantity,
        inStock,
        category,
        attributes
      });
    }

    await cart.save();
    return res.status(201).json({ success: true, data: formatCart(cart) });
  } catch (error) {
    console.error('addItem error', error);
    return res.status(500).json({ success: false, message: 'Unable to add item to cart.' });
  }
};

export const updateItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const normalizedQuantity = Number(quantity);

  if (!productId || Number.isNaN(normalizedQuantity) || normalizedQuantity < 1) {
    return res.status(400).json({ success: false, message: 'Valid productId and numeric quantity are required.' });
  }

  try {
    const cart = await ensureCart(req.user.id);
    const item = cart.items.find((entry) => entry.productId === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }
    item.quantity = Math.floor(normalizedQuantity);
    await cart.save();
    return res.json({ success: true, data: formatCart(cart) });
  } catch (error) {
    console.error('updateItemQuantity error', error);
    return res.status(500).json({ success: false, message: 'Unable to update quantity.' });
  }
};

export const removeItem = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required.' });
  }

  try {
    const cart = await ensureCart(req.user.id);
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((entry) => entry.productId !== productId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    await cart.save();
    return res.json({ success: true, data: formatCart(cart) });
  } catch (error) {
    console.error('removeItem error', error);
    return res.status(500).json({ success: false, message: 'Unable to remove item.' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await ensureCart(req.user.id);
    cart.items = [];
    await cart.save();
    return res.json({ success: true, data: formatCart(cart) });
  } catch (error) {
    console.error('clearCart error', error);
    return res.status(500).json({ success: false, message: 'Unable to clear cart.' });
  }
};

export const moveToWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required.' });
  }

  try {
    const cart = await ensureCart(req.user.id);
    const wishlist = await ensureWishlist(req.user.id);

    const index = cart.items.findIndex((entry) => entry.productId === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    const [item] = cart.items.splice(index, 1);
    const alreadyWishlisted = wishlist.items.some((entry) => entry.productId === productId);
    if (!alreadyWishlisted) {
      wishlist.items.push({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        category: item.category,
        inStock: item.inStock,
        attributes: item.attributes
      });
    }

    await Promise.all([cart.save(), wishlist.save()]);
    return res.json({ success: true, data: formatCart(cart) });
  } catch (error) {
    console.error('moveToWishlist error', error);
    return res.status(500).json({ success: false, message: 'Unable to move item to wishlist.' });
  }
};
