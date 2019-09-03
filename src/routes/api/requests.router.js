import express from 'express';
import auth from '../../middlewares/auth';
import RequestController from '../../controllers/request.controller';
import RequestMiddleware from '../../middlewares/requests.middleware';
import validateRequests from '../../validation/request.validation';
import Validator from '../../validation/index';
import Auth from '../../middlewares/auth.middleware';

const router = express.Router();

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

export default router;
