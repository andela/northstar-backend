import express from 'express';
import auth from '../../middlewares/auth';
import RequestController from '../../controllers/request.controller';
import requestChecks from '../../middlewares/requests.middleware';
import validateRequests from '../../validation/request.validation';
import Auth from '../../middlewares/auth.middleware';

const router = express.Router();

/* Requests Routes Here */
router.patch('/request/:id',
  auth.verifyUserToken,
  auth.verifyManager,
  validateRequests.validateRequestsID,
  requestChecks.validateRequests,
  RequestController.rejectRequest);

router.get('/requests', Auth.verifyToken, RequestController.findAll);

/* Multi City Request route */

const { createMultiCityRequest } = RequestController;
const { verifyUserToken } = auth;

router.post('/request/multiCity', verifyUserToken, createMultiCityRequest);

export default router;
