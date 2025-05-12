const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  const { clientId, lawyerId, date } = req.body;
  const booking = await Booking.create({ clientId, lawyerId, date });
  res.status(201).json(booking);
};

exports.getBookingsForLawyer = async (req, res) => {
  const { lawyerId } = req.params;
  const bookings = await Booking.find({ lawyerId }).populate('clientId', 'username email');
  res.json(bookings);
};
