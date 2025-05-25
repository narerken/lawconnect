const multer = require('multer');
const path = require('path');

// Папка для аватарок
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) 
    return cb(new Error('Только изображения'));
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 } });

module.exports = upload;
