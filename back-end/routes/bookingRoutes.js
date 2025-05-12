const express = require('express');
const {
  createBooking,
  getBookingsForLawyer,
} = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);
router.get('/:lawyerId', getBookingsForLawyer);

module.exports = router;
