import path from 'path';

export function handleImageUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file received' });
  }

  const relativePath = path.posix.join('uploads', req.uploadCategory || '', req.file.filename);
  const baseUrl = process.env.ASSET_BASE_URL || `${req.protocol}://${req.get('host')}`;

  return res.status(201).json({
    success: true,
    data: {
      path: `/${relativePath}`,
      url: `${baseUrl}/${relativePath}`,
      filename: req.file.filename,
      category: req.uploadCategory
    }
  });
}
