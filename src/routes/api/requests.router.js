import express from 'express';
import auth from '../../middlewares/auth';
import RequestController from '../../controllers/request.controller';
import RequestMiddleware from '../../middlewares/requests.middleware';
import validateRequests from '../../validation/request.validation';
import Validator from '../../validation/index';
import RequestSchema from '../../schemas/request.schema';
import ValidationMiddleware from '../../middlewares/validation.middleware';
import Auth from '../../middlewares/auth.middleware';

const router = express.Router();

const { requestSchema } = RequestSchema;
const { validate } = ValidationMiddleware;

/* Requests Routes Here */
router.patch('/requests/decline/:id',
  auth.verifyUserToken,
  auth.verifyManager,
  validateRequests.validateRequestsID,
  RequestMiddleware.validateRequests,
  RequestController.rejectRequest);

router.post('/requests', Auth.verifyToken, Validator.Requests, RequestController.TripRequests);
router.get('/requests/:request_id', Auth.verifyToken, RequestController.getSingleRequest);

router.post('/request/multi-city', auth.verifyUserToken, RequestController.createMultiCityRequest);
router.get('/requests', Auth.verifyToken, RequestMiddleware.prepareRequestQuery, RequestController.findAll);
router.patch('/requests/:request_id', Auth.verifyToken, RequestMiddleware.checkRequestStatus, validate(requestSchema), RequestController.editRequest);
router.patch('/requests/approve/:id', auth.verifyUserToken, auth.verifyManager, validateRequests.validateRequestsID, RequestMiddleware.validateRequests, RequestController.approveRequest);

export default router;
