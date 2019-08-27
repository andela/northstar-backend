import express from 'express';
import auth from '../../middlewares/auth';
import RequestsController from '../../controllers/requests.controller';
import requestChecks from '../../middlewares/requests.middleware';

const router = express.Router();

/* Requests Routes Here */
router.patch('/requests/:id',
  auth.verifyUserToken,
  auth.verifyManager,
  requestChecks.validateRequests,
  RequestsController.rejectRequest);

export default router;
