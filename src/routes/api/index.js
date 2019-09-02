import express from 'express';

import authRouter from './auth.router';
import multicityRouter from './requests';
import requestRouter from './requests.router';


const router = express.Router();

router.use('/auth', authRouter);
router.use('/request', multicityRouter);
router.use('/', requestRouter);

export default router;

