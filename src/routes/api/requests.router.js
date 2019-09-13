import express from 'express';
import auth from '../../middlewares/auth';
import RequestController from '../../controllers/request.controller';
import requestChecks from '../../middlewares/requests.middleware';
import validateRequests from '../../validation/request.validation';
import Validator from '../../validation/index';
import Auth from '../../middlewares/auth.middleware';
import RequestSchema from '../../schemas/request.schema';
import ValidationMiddleware from '../../middlewares/validation.middleware';

const router = express.Router();
const { validate } = ValidationMiddleware;
const { requestSchema } = RequestSchema;

/* Requests Routes Here */
router.patch('/requests/decline/:id',
  auth.verifyUserToken,
  auth.verifyManager,
  validateRequests.validateRequestsID,
  requestChecks.validateRequests,
  RequestController.rejectRequest);

router.get('/requests', Auth.verifyToken, RequestController.findAll);
router.post('/requests', Auth.verifyToken, Validator.Requests, RequestController.TripRequests);
router.get('/requests/:request_id', Auth.verifyToken, RequestController.getSingleRequest);
router.patch('/requests/:request_id', Auth.verifyToken, requestChecks.checkRequestStatus, validate(requestSchema), RequestController.editRequest);
router.post('/request/multi-city', auth.verifyUserToken, RequestController.createMultiCityRequest);

export default router;
