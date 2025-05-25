const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { email, username, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, password: hashedPassword, role });

  res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, email: user.email, username: user.username, role: user.role, points: user.points } });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

  // создаём токен и сохраняем хеш в БД
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = hash;
  user.resetPasswordExpire = Date.now() + 3600000; // 1 час
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONT_URL}/reset-password/${resetToken}`;
  const message = `Перейдите по ссылке для сброса пароля:\n\n${resetUrl}`;

  try {
    await sendEmail({ to: user.email, subject: 'Сброс пароля', text: message });
    res.json({ message: 'Письмо с инструкциями отправлено' });
  } catch (err) {
    console.error('sendEmail error:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ message: 'Не удалось отправить письмо' });
  }
};

// Сброс пароля по токену
exports.resetPassword = async (req, res) => {
  const resetToken = req.params.token;
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Неверный или просроченный токен' });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Пароль успешно сброшен' });
};