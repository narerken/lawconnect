const User = require('../models/User');
const bcrypt = require('bcrypt');
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    if (username) user.username = username;
    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      username: user.username,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
};