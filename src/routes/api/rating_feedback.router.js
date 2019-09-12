import express from 'express';
import Auth from '../../middlewares/auth.middleware';
import RatingAndFeedbackController from '../../controllers/rating_feedback.controller';
import Validator from '../../validation/index';

const router = express.Router();

router.post('/rating-feedback/facility', Auth.verifyToken,
  Validator.ratingAndFeedback, RatingAndFeedbackController.postRatingAndFeedback);

export default router;
