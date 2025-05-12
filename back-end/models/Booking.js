const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);
