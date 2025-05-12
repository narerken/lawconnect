const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  const { clientId, lawyerId, date } = req.body;
  const booking = await Booking.create({ clientId, lawyerId, date });
  res.status(201).json(booking);
};

exports.getBookingsForLawyer = async (req, res) => {
  const bookings = await Booking.find({ lawyerId: req.params.lawyerId }).populate('clientId', 'username');
  res.json(bookings);
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  await Booking.findByIdAndUpdate(bookingId, { status });
  res.json({ message: 'Booking updated' });
};