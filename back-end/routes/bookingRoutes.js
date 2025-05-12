const router = require('express').Router();
const bc = require('../controllers/bookingController');
router.post('/', bc.createBooking);
router.get('/:lawyerId', bc.getBookingsForLawyer);
router.post('/status', bc.updateBookingStatus);
module.exports = router;