import express from 'express';
import auth from '../../middlewares/auth';
import facilitiesController from '../../controllers/facilities.controller';
import validateFacilities from '../../validation/facilities/facilities.validation';
import validateRooms from '../../validation/facilities/rooms.validation';
import FacilitiesChecks from '../../middlewares/facilities.middleware';

const router = express.Router();

/* Requests Routes Here */
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
export default router;
