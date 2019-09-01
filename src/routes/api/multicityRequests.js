import express from 'express';
import RequestController from '../../controllers/multiCityRequest.controller';
import authMiddleware from '../../middlewares/auth'

const router = express.Router();

const { createMultiCityRequest } = RequestController
const { verifyUserToken } = authMiddleware
/* Request routes */
router.post('/multiCity', verifyUserToken, createMultiCityRequest )


export default router;
