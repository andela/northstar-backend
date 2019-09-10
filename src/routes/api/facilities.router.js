import express from 'express';
import auth from '../../middlewares/auth';
import facilitiesController from '../../controllers/facilities.controller';
import validateFacilities from '../../validation/facilities/facilities.validation';
import validateRooms from '../../validation/facilities/rooms.validation';
import FacilitiesChecks from '../../middlewares/facilities.middleware';


const router = express.Router();

/* Requests Routes Here */
router.post('/facilities/:facility_id/:like',
  auth.verifyUserToken,
  facilitiesController.likeOrUnlikeFacility);

router.post('/facilities',
  auth.verifyUserToken,
  auth.verifyTravelAdmin,
  FacilitiesChecks.getFacilitiesValues,
  validateFacilities,
  facilitiesController.createFacilities);

router.post('/facilities/rooms',
  auth.verifyUserToken,
  auth.verifyTravelAdmin,
  FacilitiesChecks.getRoomsValues,
  validateRooms,
  facilitiesController.createRoom);

router.get('/facilities',
  facilitiesController.getAllFacilities);

router.post('/facilities/rooms/:room_id/book', auth.verifyUserToken,
  FacilitiesChecks.validateBookingDates, facilitiesController.bookFacility);

export default router;
