import express from 'express';
import Auth from '../../middlewares/auth.middleware';
import FeedbackController from '../../controllers/feedback.controller';
import Validator from '../../validation/index';

const router = express.Router();

router.post('/feedback/facility/:id', Auth.verifyToken,
  Validator.feedback, FeedbackController.postFeedback);

export default router;
