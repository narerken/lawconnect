const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'lawyer'], required: true },
  points: { type: Number, default: 0 },
  notifications: [{ message: String, read: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } }],
   resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpire: {
    type: Date,
    default: undefined
  },
   avatar: {
  type: String,
  default: '',
}
});
module.exports = mongoose.model('User', userSchema);
