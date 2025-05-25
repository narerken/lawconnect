const User = require('../models/User');

// A. Получить свой профиль
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// B. Обновить персональные данные и настройки
exports.updateMe = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    'settings.notifications.email': req.body.notifications.email,
    'settings.notifications.inApp': req.body.notifications.inApp,
    'settings.theme': req.body.theme,
    'settings.language': req.body.language,
  };
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
    .select('-password');
  res.json(user);
};

// B. Загрузка аватара
exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Файл не найден' });
  const avatarUrl = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user.id, { avatarUrl }, { new: true })
    .select('-password');
  res.json({ avatarUrl: user.avatarUrl });
};
