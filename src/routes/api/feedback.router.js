import express from 'express';
import Auth from '../../middlewares/auth.middleware';
import FeedbackController from '../../controllers/feedback.controller';
import Validator from '../../validation/index';

const router = express.Router();

router.get('/feedback/facility/:id', Auth.verifyToken, Auth.isAdmin, Validator.facilityID, FeedbackController.findAll);

export default router;
