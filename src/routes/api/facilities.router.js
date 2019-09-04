import express from 'express';
import auth from '../../middlewares/auth';
import facilitiesController from '../../controllers/facilities.controller';
import validateFacilities from '../../validation/facilities.validation';
import validateRooms from '../../validation/rooms.validation';
import getFacilitiesValues from '../../middlewares/facilities.middleware';
import getRoomsValues from '../../middlewares/rooms.middleware';

const router = express.Router();

/* Requests Routes Here */
router.post('/facilities',
  auth.verifyUserToken,
  auth.verifyTravelAdmin,
  getFacilitiesValues,
  validateFacilities,
  facilitiesController.createFacilities);

router.post('/facilities/rooms',
  auth.verifyUserToken,
  auth.verifyTravelAdmin,
  getRoomsValues,
  validateRooms,
  facilitiesController.createRoom);

export default router;
