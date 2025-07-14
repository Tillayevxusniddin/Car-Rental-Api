const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

router.route('/')
    .post(protect, bookingController.createBooking)
    .get(protect, bookingController.getBookings);

router.route('/:id')
    .get(protect, bookingController.getBooking)
    .delete(protect, bookingController.cancelBooking); 
module.exports = router;
