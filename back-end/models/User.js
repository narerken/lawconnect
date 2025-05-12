const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'lawyer'], required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
