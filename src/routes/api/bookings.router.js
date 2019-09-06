import express from 'express';
import auth from '../../middlewares/auth';
import Bookings from '../../controllers/bookings.controller';
import validateCheckIn from '../../validation/booking/checkin.validation';

const router = express.Router();

router.patch('/bookings/:booking_id/checkin', auth.verifyUserToken, validateCheckIn, Bookings.checkInUser);

export default router;
