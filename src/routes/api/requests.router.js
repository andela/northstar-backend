import express from 'express';
import auth from '../../middlewares/auth';
import RequestsController from '../../controllers/requests.controller';
import requestChecks from '../../middlewares/requests.middleware';
import validateRequests from '../../validation/request.validation';

const router = express.Router();

/* Requests Routes Here */
router.patch('/request/:id',
  auth.verifyUserToken,
  auth.verifyManager,
  validateRequests.validateRequestsID,
  requestChecks.validateRequests,
  RequestsController.rejectRequest);

export default router;
