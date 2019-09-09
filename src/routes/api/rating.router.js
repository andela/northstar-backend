import express from 'express';
import RatingController from '../../controllers/rating.controller';
import Validator from '../../validation/index';

const router = express.Router();

router.get('/rating/facility/:id', Validator.facilityID, RatingController.findAll);

export default router;
