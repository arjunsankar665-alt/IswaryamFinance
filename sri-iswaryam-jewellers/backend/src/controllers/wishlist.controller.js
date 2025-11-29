import Wishlist from '../models/wishlist.model.js';

const ensureWishlist = async (userId) => {
  const existing = await Wishlist.findOne({ user: userId });
  if (existing) {
    return existing;
  }
  return Wishlist.create({ user: userId, items: [] });
};

const formatWishlist = (wishlist) => ({
  id: wishlist?._id?.toString(),
  items: (wishlist?.items ?? []).map((item) => ({
    productId: item.productId,
    name: item.name,
    slug: item.slug,
    image: item.image,
    price: item.price,
    category: item.category,
    inStock: item.inStock,
    attributes: item.attributes || {}
  })),
  updatedAt: wishlist?.updatedAt
});

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await ensureWishlist(req.user.id);
    return res.json({ success: true, data: formatWishlist(wishlist) });
  } catch (error) {
    console.error('getWishlist error', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch wishlist.' });
  }
};

export const addToWishlist = async (req, res) => {
  const { productId, name, price, image, slug, category, inStock = true, attributes = {} } = req.body;
  const normalizedPrice = price === undefined || price === null ? undefined : Number(price);
  if (!productId || !name) {
    return res.status(400).json({ success: false, message: 'productId and name are required.' });
  }
  if (price !== undefined && Number.isNaN(normalizedPrice)) {
    return res.status(400).json({ success: false, message: 'price must be numeric when provided.' });
  }

  try {
    const wishlist = await ensureWishlist(req.user.id);
    const exists = wishlist.items.some((item) => item.productId === productId);
    if (!exists) {
      wishlist.items.push({ productId, name, price: normalizedPrice, image, slug, category, inStock, attributes });
      await wishlist.save();
    }
    return res.status(201).json({ success: true, data: formatWishlist(wishlist) });
  } catch (error) {
    console.error('addToWishlist error', error);
    return res.status(500).json({ success: false, message: 'Unable to add item to wishlist.' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required.' });
  }

  try {
    const wishlist = await ensureWishlist(req.user.id);
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter((item) => item.productId !== productId);

    if (wishlist.items.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist.' });
    }

    await wishlist.save();
    return res.json({ success: true, data: formatWishlist(wishlist) });
  } catch (error) {
    console.error('removeFromWishlist error', error);
    return res.status(500).json({ success: false, message: 'Unable to remove item from wishlist.' });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await ensureWishlist(req.user.id);
    wishlist.items = [];
    await wishlist.save();
    return res.json({ success: true, data: formatWishlist(wishlist) });
  } catch (error) {
    console.error('clearWishlist error', error);
    return res.status(500).json({ success: false, message: 'Unable to clear wishlist.' });
  }
};
